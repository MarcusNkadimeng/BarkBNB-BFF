CREATE TABLE users (
    uid TEXT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cellnumber VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user'))
);

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    user_uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
    name VARCHAR(100),
    breed VARCHAR(100),
    image VARCHAR(255),
    dietary_requirements VARCHAR(200),
    medical_requirements VARCHAR(200),
    gender VARCHAR(10),
    birthdate DATE,
    vaccine_status VARCHAR(100),
    neutered BOOLEAN
);

CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
    service_packkage_id INT REFERENCES packages(id) ON DELETE SET NULL,
    unit_id INT REFERENCES units(id) ON DELETE SET NULL,
    booking_date TIMESTAMP NOT NULL DEFAULT NOW()
);
