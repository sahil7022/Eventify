-- Eventify Database Schema

CREATE DATABASE IF NOT EXISTS eventify;
USE eventify;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  institution VARCHAR(255),
  department VARCHAR(100),
  year VARCHAR(50),
  role ENUM('participant', 'organizer', 'admin') DEFAULT 'participant',
  collegeId INT,
  resetToken VARCHAR(255),
  resetTokenExpiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INT PRIMARY KEY,
  name VARCHAR(255),
  college VARCHAR(255),
  dept VARCHAR(100),
  mobile VARCHAR(20),
  bio TEXT,
  skills TEXT,
  goal TEXT,
  avatar TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATETIME,
  location VARCHAR(255),
  collegeId INT,
  departmentId INT,
  created_by INT,
  banner_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sub-Events Table
CREATE TABLE IF NOT EXISTS sub_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  time VARCHAR(100),
  location VARCHAR(255),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_id INT,
  team_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'Participant',
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id INT,
  event_id INT,
  PRIMARY KEY (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Notices Table
CREATE TABLE IF NOT EXISTS notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- External Event Requests
CREATE TABLE IF NOT EXISTS external_event_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  college_name VARCHAR(255),
  event_name VARCHAR(255),
  event_details TEXT,
  website_link VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizer Applications
CREATE TABLE IF NOT EXISTS organizer_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_id INT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
