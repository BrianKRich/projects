package main

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	db            *pgxpool.Pool
	adminUsername string
	adminPassword string
	adminSecret   string
)

// --- Data models ---

type Athlete struct {
	ID             int       `json:"id"`
	Name           string    `json:"name"`
	Gender         string    `json:"gender,omitempty"`
	Grade          int       `json:"grade"`
	PersonalRecord string    `json:"personal_record,omitempty"`
	Events         string    `json:"events,omitempty"`
	CreatedAt      time.Time `json:"created_at,omitempty"`
}

type Meet struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Date        string    `json:"date"`
	Location    string    `json:"location,omitempty"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
}

type Result struct {
	ID        int    `json:"id"`
	AthleteID int    `json:"athleteId"`
	MeetID    int    `json:"meetId"`
	Time      string `json:"time"`
	Place     int    `json:"place,omitempty"`
}

type Coach struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Title string `json:"title"`
	Bio   string `json:"bio,omitempty"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// --- Token helpers ---

func generateToken(username string) string {
	expiry := time.Now().Add(24 * time.Hour).Unix()
	payload := fmt.Sprintf("%s:%d", username, expiry)
	mac := hmac.New(sha256.New, []byte(adminSecret))
	mac.Write([]byte(payload))
	sig := hex.EncodeToString(mac.Sum(nil))
	return payload + "." + sig
}

func validateToken(tokenString string) (string, bool) {
	parts := strings.SplitN(tokenString, ".", 2)
	if len(parts) != 2 {
		return "", false
	}
	payload, sig := parts[0], parts[1]

	mac := hmac.New(sha256.New, []byte(adminSecret))
	mac.Write([]byte(payload))
	expected := hex.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(sig), []byte(expected)) {
		return "", false
	}

	// Parse expiry from payload
	colonIdx := strings.LastIndex(payload, ":")
	if colonIdx < 0 {
		return "", false
	}
	username := payload[:colonIdx]
	expiryStr := payload[colonIdx+1:]
	expiry, err := strconv.ParseInt(expiryStr, 10, 64)
	if err != nil {
		return "", false
	}
	if time.Now().Unix() > expiry {
		return "", false
	}
	return username, true
}

// --- Middleware ---

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func methodGateHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost || r.Method == http.MethodPut || r.Method == http.MethodDelete {
			authHeader := r.Header.Get("Authorization")
			if !strings.HasPrefix(authHeader, "Bearer ") {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
				return
			}
			token := strings.TrimPrefix(authHeader, "Bearer ")
			if _, ok := validateToken(token); !ok {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
				return
			}
		}
		next(w, r)
	}
}

// --- Main ---

func main() {
	// Database connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://xc_app:xc_password_123@localhost:5432/jones_county_xc?sslmode=disable"
	}

	// Admin credentials
	adminUsername = os.Getenv("ADMIN_USERNAME")
	if adminUsername == "" {
		adminUsername = "admin"
	}
	adminPassword = os.Getenv("ADMIN_PASSWORD")
	if adminPassword == "" {
		adminPassword = "changeme"
	}
	adminSecret = os.Getenv("ADMIN_SECRET")
	if adminSecret == "" {
		adminSecret = "xc-secret-key-change-in-prod"
	}

	var err error
	db, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}
	log.Println("Connected to database")

	// Routes
	http.HandleFunc("/health", corsMiddleware(healthHandler))
	http.HandleFunc("/api/login", corsMiddleware(loginHandler))
	http.HandleFunc("/api/athletes", corsMiddleware(methodGateHandler(athletesHandler)))
	http.HandleFunc("/api/meets", corsMiddleware(methodGateHandler(meetsHandler)))
	http.HandleFunc("/api/results", corsMiddleware(methodGateHandler(resultsHandler)))
	http.HandleFunc("/api/coaches", corsMiddleware(methodGateHandler(coachesHandler)))

	// Serve static frontend files
	frontendDist := "../frontend/dist"
	fs := http.FileServer(http.Dir(frontendDist))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(frontendDist, r.URL.Path)
		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(frontendDist, "index.html"))
			return
		}
		fs.ServeHTTP(w, r)
	})

	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

// --- Handlers ---

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	err := db.Ping(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]string{"status": "unhealthy", "error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "database": "connected"})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Method not allowed"})
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	// Constant-time comparison for both username and password
	userMatch := hmac.Equal([]byte(req.Username), []byte(adminUsername))
	passMatch := hmac.Equal([]byte(req.Password), []byte(adminPassword))

	if !userMatch || !passMatch {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid credentials"})
		return
	}

	token := generateToken(req.Username)
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// --- Athletes ---

func athletesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query(context.Background(),
			`SELECT id, name, COALESCE(gender, ''), grade, COALESCE(personal_record, ''), COALESCE(events, '')
			 FROM athletes ORDER BY name`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		athletes := []Athlete{}
		for rows.Next() {
			var a Athlete
			if err := rows.Scan(&a.ID, &a.Name, &a.Gender, &a.Grade, &a.PersonalRecord, &a.Events); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			athletes = append(athletes, a)
		}
		json.NewEncoder(w).Encode(athletes)

	case http.MethodPost:
		var a Athlete
		if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err := db.QueryRow(context.Background(),
			"INSERT INTO athletes (name, gender, grade, personal_record, events) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			a.Name, a.Gender, a.Grade, a.PersonalRecord, a.Events).Scan(&a.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(a)

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		var a Athlete
		if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(),
			"UPDATE athletes SET name=$1, gender=$2, grade=$3, personal_record=$4, events=$5 WHERE id=$6",
			a.Name, a.Gender, a.Grade, a.PersonalRecord, a.Events, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Athlete not found", http.StatusNotFound)
			return
		}
		a.ID = id
		json.NewEncoder(w).Encode(a)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(), "DELETE FROM athletes WHERE id = $1", id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Athlete not found", http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// --- Meets ---

func meetsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query(context.Background(),
			`SELECT id, name, date, COALESCE(location, ''), COALESCE(description, '')
			 FROM meets ORDER BY date DESC`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		meets := []Meet{}
		for rows.Next() {
			var m Meet
			var date time.Time
			if err := rows.Scan(&m.ID, &m.Name, &date, &m.Location, &m.Description); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			m.Date = date.Format("2006-01-02")
			meets = append(meets, m)
		}
		json.NewEncoder(w).Encode(meets)

	case http.MethodPost:
		var m Meet
		if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err := db.QueryRow(context.Background(),
			"INSERT INTO meets (name, date, location, description) VALUES ($1, $2, $3, $4) RETURNING id",
			m.Name, m.Date, m.Location, m.Description).Scan(&m.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(m)

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		var m Meet
		if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(),
			"UPDATE meets SET name=$1, date=$2, location=$3, description=$4 WHERE id=$5",
			m.Name, m.Date, m.Location, m.Description, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Meet not found", http.StatusNotFound)
			return
		}
		m.ID = id
		json.NewEncoder(w).Encode(m)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(), "DELETE FROM meets WHERE id = $1", id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Meet not found", http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// --- Results ---

func resultsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		meetID := r.URL.Query().Get("meetId")
		athleteID := r.URL.Query().Get("athleteId")
		var rows pgx.Rows
		var err error

		query := `SELECT id, athlete_id, meet_id, time, COALESCE(place, 0) FROM results`

		if meetID != "" {
			id, _ := strconv.Atoi(meetID)
			rows, err = db.Query(context.Background(), query+" WHERE meet_id = $1 ORDER BY place, time", id)
		} else if athleteID != "" {
			id, _ := strconv.Atoi(athleteID)
			rows, err = db.Query(context.Background(), query+" WHERE athlete_id = $1 ORDER BY meet_id", id)
		} else {
			rows, err = db.Query(context.Background(), query+" ORDER BY meet_id, place")
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		results := []Result{}
		for rows.Next() {
			var res Result
			if err := rows.Scan(&res.ID, &res.AthleteID, &res.MeetID, &res.Time, &res.Place); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			results = append(results, res)
		}
		json.NewEncoder(w).Encode(results)

	case http.MethodPost:
		var res Result
		if err := json.NewDecoder(r.Body).Decode(&res); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err := db.QueryRow(context.Background(),
			"INSERT INTO results (athlete_id, meet_id, time, place) VALUES ($1, $2, $3, $4) RETURNING id",
			res.AthleteID, res.MeetID, res.Time, res.Place).Scan(&res.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(res)

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		var res Result
		if err := json.NewDecoder(r.Body).Decode(&res); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(),
			"UPDATE results SET athlete_id=$1, meet_id=$2, time=$3, place=$4 WHERE id=$5",
			res.AthleteID, res.MeetID, res.Time, res.Place, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Result not found", http.StatusNotFound)
			return
		}
		res.ID = id
		json.NewEncoder(w).Encode(res)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(), "DELETE FROM results WHERE id = $1", id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Result not found", http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// --- Coaches ---

func coachesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query(context.Background(),
			`SELECT id, name, title, COALESCE(bio, '') FROM coaches ORDER BY id`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		coaches := []Coach{}
		for rows.Next() {
			var c Coach
			if err := rows.Scan(&c.ID, &c.Name, &c.Title, &c.Bio); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			coaches = append(coaches, c)
		}
		json.NewEncoder(w).Encode(coaches)

	case http.MethodPost:
		var c Coach
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err := db.QueryRow(context.Background(),
			"INSERT INTO coaches (name, title, bio) VALUES ($1, $2, $3) RETURNING id",
			c.Name, c.Title, c.Bio).Scan(&c.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(c)

	case http.MethodPut:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		var c Coach
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(),
			"UPDATE coaches SET name=$1, title=$2, bio=$3 WHERE id=$4",
			c.Name, c.Title, c.Bio, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Coach not found", http.StatusNotFound)
			return
		}
		c.ID = id
		json.NewEncoder(w).Encode(c)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "ID parameter required", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		result, err := db.Exec(context.Background(), "DELETE FROM coaches WHERE id = $1", id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if result.RowsAffected() == 0 {
			http.Error(w, "Coach not found", http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
