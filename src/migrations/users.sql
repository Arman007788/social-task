CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "dateOfBirth" DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
