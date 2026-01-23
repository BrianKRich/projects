.PHONY: dev-frontend dev-backend build build-frontend build-backend run clean

# Development
dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && go run main.go

# Build
build: build-frontend build-backend

build-frontend:
	cd frontend && npm run build

build-backend:
	cd backend && go build -o server main.go

# Production
run:
	cd backend && ./server

# Utilities
clean:
	rm -rf frontend/dist backend/server
