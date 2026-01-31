#!/bin/bash
# Setup script for Jones County XC on Lightsail
# Run this once on your Lightsail instance

set -e

echo "=== Jones County XC - Lightsail Setup ==="

# Update system
echo "Updating system packages..."
sudo apt update

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
echo "Starting PostgreSQL..."
sudo service postgresql start

# Create database and user
echo "Setting up database..."
sudo -u postgres psql <<EOF
CREATE DATABASE jones_county_xc;
CREATE USER xc_app WITH PASSWORD 'xc_password_123';
GRANT ALL PRIVILEGES ON DATABASE jones_county_xc TO xc_app;
\c jones_county_xc
GRANT ALL ON SCHEMA public TO xc_app;
EOF

# Create tables
echo "Creating tables..."
sudo -u postgres psql -d jones_county_xc <<EOF
-- Teams table (schools/clubs)
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    school VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2) DEFAULT 'GA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Runners table
CREATE TABLE runners (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    grade INTEGER CHECK (grade BETWEEN 6 AND 12),
    team_id INTEGER REFERENCES teams(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meets table (race events)
CREATE TABLE meets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(100),
    distance_meters INTEGER DEFAULT 5000,
    course_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results table (individual race results)
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    runner_id INTEGER REFERENCES runners(id) ON DELETE CASCADE,
    meet_id INTEGER REFERENCES meets(id) ON DELETE CASCADE,
    finish_time INTERVAL NOT NULL,
    place INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(runner_id, meet_id)
);

-- Grant table privileges to app user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO xc_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO xc_app;

-- Create indexes for common queries
CREATE INDEX idx_runners_team ON runners(team_id);
CREATE INDEX idx_results_runner ON results(runner_id);
CREATE INDEX idx_results_meet ON results(meet_id);
CREATE INDEX idx_meets_date ON meets(date);
EOF

# Ensure PostgreSQL starts on boot
echo "Enabling PostgreSQL on boot..."
sudo systemctl enable postgresql

# Create projects directory if it doesn't exist
mkdir -p ~/projects/backend
mkdir -p ~/projects/frontend/dist

echo ""
echo "=== Setup Complete ==="
echo "Database: jones_county_xc"
echo "User: xc_app"
echo "Password: xc_password_123"
echo ""
echo "PostgreSQL is running and will start automatically on boot."
echo "You can now deploy the application using GitHub Actions."
