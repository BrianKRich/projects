# React Project

A full-stack application with React frontend and Go backend.

## Project Structure

```
react-project/
├── frontend/     # React app with Vite and Tailwind CSS
├── backend/      # Go HTTP server
├── docs/         # Documentation
└── README.md
```

## Frontend

React application built with:
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Development

```bash
cd frontend
npm install
npm run dev     # Start dev server at localhost:5173
npm run build   # Build for production
```

## Backend

Go HTTP server with:
- REST API endpoints
- Static file serving for React build
- CORS middleware for development

### Development

```bash
cd backend
go run main.go              # Start server at localhost:8080
go build -o server main.go  # Build binary
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |

## Quick Start

1. **Build frontend:**
   ```bash
   cd frontend && npm install && npm run build
   ```

2. **Run backend:**
   ```bash
   cd backend && go run main.go
   ```

3. **Open:** http://localhost:8080

## Makefile Commands

```bash
make dev-frontend   # Run React dev server
make dev-backend    # Run Go server
make build          # Build both frontend and backend
make run            # Run production server
make clean          # Clean build artifacts
```
