package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var db *pgxpool.Pool

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

func main() {
	// Database connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://xc_app:xc_password_123@localhost:5432/jones_county_xc?sslmode=disable"
	}

	var err error
	db, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer db.Close()

	// Verify connection
	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}
	log.Println("Connected to database")

	// API routes with CORS
	http.HandleFunc("/health", corsMiddleware(healthHandler))
	http.HandleFunc("/api/athletes", corsMiddleware(athletesHandler))
	http.HandleFunc("/api/meets", corsMiddleware(meetsHandler))
	http.HandleFunc("/api/results", corsMiddleware(resultsHandler))

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

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

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

// Athletes handler - GET (list), POST (create), and DELETE (remove)
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

// Meets handler - GET (list), POST (create), and DELETE (remove)
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

// Results handler - GET (list), POST (create), and DELETE (remove)
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
