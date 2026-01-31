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
- PostgreSQL (v16+)

### Database Setup

1. Install PostgreSQL:
```bash
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

2. Create the database and user:
```bash
sudo -u postgres psql -c "CREATE DATABASE jones_county_xc;"
sudo -u postgres psql -c "CREATE USER xc_app WITH PASSWORD 'xc_password_123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE jones_county_xc TO xc_app;"
```

3. Create the tables:
```bash
sudo -u postgres psql -d jones_county_xc -f docs/schema.sql
```

4. (Optional) Load seed data for development:
```bash
sudo -u postgres psql -d jones_county_xc -f docs/seed-data.sql
```
This loads sample data including 12 teams, 100 runners, 5 meets, and 38 results.

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
| `/health` | GET | Health check with database status |
| `/api/hello` | GET | Returns a greeting message |
| `/api/teams` | GET | List all teams |
| `/api/teams` | POST | Create a team |
| `/api/runners` | GET | List all runners (optional `?team_id=`) |
| `/api/runners` | POST | Create a runner |
| `/api/meets` | GET | List all meets |
| `/api/meets` | POST | Create a meet |
| `/api/results` | GET | List results (optional `?meet_id=` or `?runner_id=`) |
| `/api/results` | POST | Create a result |

## Make Commands

Run from the project root:

| Command | Description |
|---------|-------------|
| `make run` | Run the backend server |
| `make build` | Build the backend binary |
| `make frontend-dev` | Start frontend dev server |
| `make frontend-build` | Build frontend for production |
| `make db-start` | Start PostgreSQL |
| `make db-stop` | Stop PostgreSQL |
| `make db-connect` | Connect to database via psql |

## Development

- Frontend uses Vite for fast development and hot module replacement
- Frontend uses Tailwind CSS for utility-first styling
- Backend is a Go HTTP server with PostgreSQL database
- Database uses pgx driver for PostgreSQL connectivity
- Backend binary is built during deployment (not committed to repo)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Go, pgx |
| Database | PostgreSQL 16 |
| Deployment | AWS Lightsail, GitHub Actions |
