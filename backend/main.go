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

type Team struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	School    string    `json:"school,omitempty"`
	City      string    `json:"city,omitempty"`
	State     string    `json:"state,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type Runner struct {
	ID        int       `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Gender    string    `json:"gender,omitempty"`
	Grade     int       `json:"grade,omitempty"`
	TeamID    *int      `json:"team_id,omitempty"`
	TeamName  string    `json:"team_name,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type Meet struct {
	ID                int       `json:"id"`
	Name              string    `json:"name"`
	Date              string    `json:"date"`
	Location          string    `json:"location,omitempty"`
	DistanceMeters    int       `json:"distance_meters"`
	CourseDescription string    `json:"course_description,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
}

type Result struct {
	ID         int       `json:"id"`
	RunnerID   int       `json:"runner_id"`
	RunnerName string    `json:"runner_name,omitempty"`
	MeetID     int       `json:"meet_id"`
	MeetName   string    `json:"meet_name,omitempty"`
	FinishTime string    `json:"finish_time"`
	Place      int       `json:"place,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
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

	// API routes
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/api/hello", helloHandler)

	// Teams endpoints
	http.HandleFunc("/api/teams", teamsHandler)

	// Runners endpoints
	http.HandleFunc("/api/runners", runnersHandler)

	// Meets endpoints
	http.HandleFunc("/api/meets", meetsHandler)

	// Results endpoints
	http.HandleFunc("/api/results", resultsHandler)

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

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Check database connection
	err := db.Ping(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]string{"status": "unhealthy", "error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "database": "connected"})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Hello from Go backend!"})
}

// Teams handler - GET (list) and POST (create)
func teamsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query(context.Background(),
			"SELECT id, name, COALESCE(school, ''), COALESCE(city, ''), COALESCE(state, ''), created_at FROM teams ORDER BY name")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		teams := []Team{}
		for rows.Next() {
			var t Team
			if err := rows.Scan(&t.ID, &t.Name, &t.School, &t.City, &t.State, &t.CreatedAt); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			teams = append(teams, t)
		}
		json.NewEncoder(w).Encode(teams)

	case http.MethodPost:
		var t Team
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err := db.QueryRow(context.Background(),
			"INSERT INTO teams (name, school, city, state) VALUES ($1, $2, $3, $4) RETURNING id, created_at",
			t.Name, t.School, t.City, t.State).Scan(&t.ID, &t.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(t)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Runners handler - GET (list) and POST (create)
func runnersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		teamID := r.URL.Query().Get("team_id")
		var rows pgx.Rows
		var err error

		if teamID != "" {
			id, _ := strconv.Atoi(teamID)
			rows, err = db.Query(context.Background(),
				`SELECT r.id, r.first_name, r.last_name, COALESCE(r.gender, ''), COALESCE(r.grade, 0),
				 r.team_id, COALESCE(t.name, ''), r.created_at
				 FROM runners r LEFT JOIN teams t ON r.team_id = t.id
				 WHERE r.team_id = $1 ORDER BY r.last_name, r.first_name`, id)
		} else {
			rows, err = db.Query(context.Background(),
				`SELECT r.id, r.first_name, r.last_name, COALESCE(r.gender, ''), COALESCE(r.grade, 0),
				 r.team_id, COALESCE(t.name, ''), r.created_at
				 FROM runners r LEFT JOIN teams t ON r.team_id = t.id
				 ORDER BY r.last_name, r.first_name`)
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		runners := []Runner{}
		for rows.Next() {
			var r Runner
			if err := rows.Scan(&r.ID, &r.FirstName, &r.LastName, &r.Gender, &r.Grade, &r.TeamID, &r.TeamName, &r.CreatedAt); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			runners = append(runners, r)
		}
		json.NewEncoder(w).Encode(runners)

	case http.MethodPost:
		var runner Runner
		if err := json.NewDecoder(r.Body).Decode(&runner); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		err := db.QueryRow(context.Background(),
			"INSERT INTO runners (first_name, last_name, gender, grade, team_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at",
			runner.FirstName, runner.LastName, runner.Gender, runner.Grade, runner.TeamID).Scan(&runner.ID, &runner.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(runner)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Meets handler - GET (list) and POST (create)
func meetsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query(context.Background(),
			`SELECT id, name, date, COALESCE(location, ''), COALESCE(distance_meters, 5000),
			 COALESCE(course_description, ''), created_at FROM meets ORDER BY date DESC`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		meets := []Meet{}
		for rows.Next() {
			var m Meet
			var date time.Time
			if err := rows.Scan(&m.ID, &m.Name, &date, &m.Location, &m.DistanceMeters, &m.CourseDescription, &m.CreatedAt); err != nil {
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
			"INSERT INTO meets (name, date, location, distance_meters, course_description) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at",
			m.Name, m.Date, m.Location, m.DistanceMeters, m.CourseDescription).Scan(&m.ID, &m.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(m)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// Results handler - GET (list) and POST (create)
func resultsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		meetID := r.URL.Query().Get("meet_id")
		runnerID := r.URL.Query().Get("runner_id")
		var rows pgx.Rows
		var err error

		query := `SELECT res.id, res.runner_id, r.first_name || ' ' || r.last_name,
				  res.meet_id, m.name, res.finish_time::text, COALESCE(res.place, 0), res.created_at
				  FROM results res
				  JOIN runners r ON res.runner_id = r.id
				  JOIN meets m ON res.meet_id = m.id`

		if meetID != "" {
			id, _ := strconv.Atoi(meetID)
			rows, err = db.Query(context.Background(), query+" WHERE res.meet_id = $1 ORDER BY res.place, res.finish_time", id)
		} else if runnerID != "" {
			id, _ := strconv.Atoi(runnerID)
			rows, err = db.Query(context.Background(), query+" WHERE res.runner_id = $1 ORDER BY m.date DESC", id)
		} else {
			rows, err = db.Query(context.Background(), query+" ORDER BY m.date DESC, res.place")
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		results := []Result{}
		for rows.Next() {
			var res Result
			if err := rows.Scan(&res.ID, &res.RunnerID, &res.RunnerName, &res.MeetID, &res.MeetName, &res.FinishTime, &res.Place, &res.CreatedAt); err != nil {
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
			"INSERT INTO results (runner_id, meet_id, finish_time, place) VALUES ($1, $2, $3::interval, $4) RETURNING id, created_at",
			res.RunnerID, res.MeetID, res.FinishTime, res.Place).Scan(&res.ID, &res.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(res)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
