-- Jones County XC Database Schema

-- Athletes table
CREATE TABLE athletes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    grade INTEGER CHECK (grade BETWEEN 9 AND 12),
    personal_record VARCHAR(20),
    events VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meets table
CREATE TABLE meets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results table
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
    meet_id INTEGER REFERENCES meets(id) ON DELETE CASCADE,
    time VARCHAR(20) NOT NULL,
    place INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(athlete_id, meet_id)
);

-- Coaches table
CREATE TABLE coaches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Future meets table
CREATE TABLE future_meets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(100),
    level VARCHAR(20) NOT NULL DEFAULT 'Varsity',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_results_athlete ON results(athlete_id);
CREATE INDEX idx_results_meet ON results(meet_id);
CREATE INDEX idx_meets_date ON meets(date);
