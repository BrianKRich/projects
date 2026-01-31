# Jones County XC

A full-stack web application with a React frontend and Go backend.

## Project Structure

```
jones-county.xc/
├── frontend/    # React application (Vite)
├── backend/     # Go API server
├── docs/        # Project documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Go (v1.21+)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend

```bash
cd backend
go run main.go
```

The backend API will be available at `http://localhost:8080`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/hello` | GET | Returns a greeting message |

## Development

- Frontend uses Vite for fast development and hot module replacement
- Backend is a simple Go HTTP server with JSON API endpoints
