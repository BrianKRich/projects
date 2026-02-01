-- Jones County XC Database Schema

-- Grant privileges to app user
GRANT ALL ON SCHEMA public TO xc_app;

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

-- Events table (race distances/categories)
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    distance_meters INTEGER NOT NULL,
    description TEXT,
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
    event_id INTEGER REFERENCES events(id),
    finish_time INTERVAL NOT NULL,
    place INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(runner_id, meet_id, event_id)
);

-- Grant table privileges to app user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO xc_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO xc_app;

-- Create indexes for common queries
CREATE INDEX idx_runners_team ON runners(team_id);
CREATE INDEX idx_results_runner ON results(runner_id);
CREATE INDEX idx_results_meet ON results(meet_id);
CREATE INDEX idx_results_event ON results(event_id);
CREATE INDEX idx_meets_date ON meets(date);
