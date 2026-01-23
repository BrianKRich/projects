package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	mux := http.NewServeMux()

	// API routes
	mux.HandleFunc("/api/health", corsMiddleware(healthHandler))

	// Static file server for React build
	frontendDist := filepath.Join("..", "frontend", "dist")
	if _, err := os.Stat(frontendDist); os.IsNotExist(err) {
		log.Printf("Warning: frontend dist directory not found at %s", frontendDist)
	}

	fs := http.FileServer(http.Dir(frontendDist))
	mux.Handle("/", spaHandler(fs, frontendDist))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// spaHandler wraps a file server to serve index.html for non-existent paths (SPA routing)
func spaHandler(fs http.Handler, distPath string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(distPath, r.URL.Path)

		// Check if file exists
		if _, err := os.Stat(path); os.IsNotExist(err) {
			// Serve index.html for SPA routing
			http.ServeFile(w, r, filepath.Join(distPath, "index.html"))
			return
		}

		fs.ServeHTTP(w, r)
	})
}
