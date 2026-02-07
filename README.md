# Jones County XC

A full-stack cross country team management web application with a React frontend and Go backend. Features athlete profiles, meet results, rankings, coaching staff, and an admin dashboard for content management.

**Live Site**: http://18.191.102.47

## Features

- 🏃‍♂️ **Athlete Profiles** - Browse team roster with personal records and stats
- 📊 **Meet Results** - View detailed results from past meets with sortable tables
- 🏆 **Rankings** - Automatic calculation of best times with medal indicators
- 👥 **Coaching Staff** - Meet the coaches with bios and contact information
- 📅 **Future Meets** - Upcoming meet schedule for Varsity and JV teams
- 🔐 **Admin Dashboard** - Secure admin panel for managing all content (athletes, meets, results, coaches, future meets)
- 📱 **Responsive Design** - Mobile-friendly interface with purple and gold team colors

## Project Structure

```
jones-county-xc/
├── frontend/           # React application (Vite + React Router)
│   ├── src/
│   │   ├── components/ # Reusable components (Layout, PrivateRoute)
│   │   ├── pages/      # Page components (Home, Athletes, Meets, etc.)
│   │   ├── context/    # Auth context for authentication state
│   │   └── hooks/      # Custom hooks (useApi for authenticated requests)
│   └── dist/           # Production build output
├── backend/            # Go API server
│   ├── main.go         # HTTP server with HMAC authentication
│   └── server          # Compiled binary (not in git)
├── docs/               # Database schema and seed data
│   ├── schema.sql      # Table definitions
│   └── seed-data.sql   # Sample data for development
└── .github/workflows/  # CI/CD pipeline
    └── deploy.yml      # Automated deployment to AWS Lightsail
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- Go (v1.22+)
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

4. Grant permissions on all tables:
```bash
sudo -u postgres psql -d jones_county_xc << EOF
GRANT ALL ON athletes TO xc_app;
GRANT USAGE, SELECT ON SEQUENCE athletes_id_seq TO xc_app;
GRANT ALL ON meets TO xc_app;
GRANT USAGE, SELECT ON SEQUENCE meets_id_seq TO xc_app;
GRANT ALL ON results TO xc_app;
GRANT USAGE, SELECT ON SEQUENCE results_id_seq TO xc_app;
GRANT ALL ON coaches TO xc_app;
GRANT USAGE, SELECT ON SEQUENCE coaches_id_seq TO xc_app;
GRANT ALL ON future_meets TO xc_app;
GRANT USAGE, SELECT ON SEQUENCE future_meets_id_seq TO xc_app;
EOF
```

5. (Optional) Load seed data for development:
```bash
sudo -u postgres psql -d jones_county_xc -f docs/seed-data.sql
```
This loads sample data including 17 athletes, 5 past meets with 85 results, 5 coaches, and 10 future meets.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend

Set environment variables for admin authentication (optional, defaults to admin/changeme):
```bash
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="your-secure-password"
export ADMIN_SECRET="your-hmac-secret-key"
```

Start the server:
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

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/login` | POST | Admin login (returns HMAC-signed token) |

**Request Body:**
```json
{
  "username": "admin",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "admin:1234567890.signature"
}
```

### Athletes
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/athletes` | GET | No | List all athletes |
| `/api/athletes` | POST | Yes | Create a new athlete |
| `/api/athletes` | PUT | Yes | Update an athlete |
| `/api/athletes?id={id}` | DELETE | Yes | Delete an athlete by ID (cascades to results) |

### Meets
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/meets` | GET | No | List all past meets |
| `/api/meets` | POST | Yes | Create a new meet |
| `/api/meets` | PUT | Yes | Update a meet |
| `/api/meets?id={id}` | DELETE | Yes | Delete a meet by ID (cascades to results) |

### Results
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/results` | GET | No | List all results |
| `/api/results?meetId={id}` | GET | No | List results for a specific meet |
| `/api/results?athleteId={id}` | GET | No | List results for a specific athlete |
| `/api/results` | POST | Yes | Create a new result |
| `/api/results` | PUT | Yes | Update a result |
| `/api/results?id={id}` | DELETE | Yes | Delete a result by ID |

### Coaches
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/coaches` | GET | No | List all coaches |
| `/api/coaches` | POST | Yes | Create a new coach |
| `/api/coaches` | PUT | Yes | Update a coach |
| `/api/coaches?id={id}` | DELETE | Yes | Delete a coach by ID |

### Future Meets
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/future-meets` | GET | No | List upcoming meets (sorted by date) |
| `/api/future-meets` | POST | Yes | Create a new future meet |
| `/api/future-meets` | PUT | Yes | Update a future meet |
| `/api/future-meets?id={id}` | DELETE | Yes | Delete a future meet by ID |

**Note:** All authenticated endpoints require `Authorization: Bearer <token>` header.

## Admin Dashboard

Access the admin dashboard at `/login`. Default credentials:
- **Username**: `admin`
- **Password**: `changeme` (change via environment variables)

The admin panel provides:
- ✏️ Full CRUD operations for athletes, meets, results, coaches, and future meets
- 🎹 Keyboard navigation with arrow keys, Home/End
- ♿ ARIA labels and accessibility features
- 📋 Tabbed interface for organized content management

## Deployment

The application is deployed to AWS Lightsail using GitHub Actions.

### Automated Deployment

Push to `main` branch triggers automatic deployment:
```bash
git push origin main
```

The workflow:
1. Builds the frontend (Vite production build)
2. Compiles the Go backend
3. Deploys to Lightsail via rsync over SSH
4. Restarts the server with environment variables from GitHub Secrets

### GitHub Secrets Required

Configure these secrets in your repository settings:
- `LIGHTSAIL_HOST` - Server IP address
- `LIGHTSAIL_USER` - SSH username (ubuntu)
- `LIGHTSAIL_SSH_KEY` - Private SSH key for authentication
- `ADMIN_USERNAME` - Admin dashboard username
- `ADMIN_PASSWORD` - Admin dashboard password
- `ADMIN_SECRET` - HMAC signing key for tokens

### Manual Deployment

SSH to the server:
```bash
ssh -i ~/.ssh/lightsail-ssh.pem ubuntu@18.191.102.47
```

Restart the server:
```bash
~/projects/start-server.sh
```

## Development

- Frontend uses **Vite** for fast development and hot module replacement
- Frontend uses **Tailwind CSS** for utility-first styling
- Frontend uses **React Router** for client-side routing
- Backend is a **Go HTTP server** with PostgreSQL database
- Database uses **pgx** driver for PostgreSQL connectivity
- Authentication uses **HMAC-SHA256** tokens (no external JWT library)
- Admin credentials stored in **environment variables** (no users table)
- Rankings computed **client-side** from results data

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router 7, Vite, Tailwind CSS |
| Backend | Go 1.22, pgx/v5 |
| Database | PostgreSQL 16 |
| Authentication | HMAC-SHA256 tokens, sessionStorage |
| Deployment | AWS Lightsail, GitHub Actions, rsync |
| Design | Purple (#4D007B) primary, Gold (#FFD700) accent |

## Architecture Decisions

- **No JWT library**: Custom HMAC-SHA256 tokens using Go stdlib only
- **No users table**: Single admin account from environment variables
- **Client-side rankings**: Best times computed in browser, no separate endpoint
- **sessionStorage**: Auth token clears on tab close for security
- **Dynamic coaches**: Fetched from database, editable via admin
- **Future meets**: Separate table for upcoming schedule (Varsity + JV)

## License

This project is private and intended for Jones County High School Cross Country team use only.
