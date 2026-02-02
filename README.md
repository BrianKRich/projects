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
This loads sample data including 17 Jones County athletes, 5 meets, and 85 results.

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

### Health
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with database status |

### Athletes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/athletes` | GET | List all athletes |
| `/api/athletes` | POST | Create a new athlete |
| `/api/athletes?id={id}` | DELETE | Delete an athlete by ID (cascades to results) |

### Meets
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/meets` | GET | List all meets |
| `/api/meets` | POST | Create a new meet |
| `/api/meets?id={id}` | DELETE | Delete a meet by ID (cascades to results) |

### Results
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/results` | GET | List all results |
| `/api/results?meetId={id}` | GET | List results for a specific meet |
| `/api/results?athleteId={id}` | GET | List results for a specific athlete |
| `/api/results` | POST | Create a new result |
| `/api/results?id={id}` | DELETE | Delete a result by ID |

**Note:** The web interface includes an interactive API documentation viewer accessible via the "Show API Docs" button.

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
