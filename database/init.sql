CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skin_name TEXT NOT NULL,
    category TEXT NOT NULL,
    skin_value FLOAT NOT NULL,
    stock INT NOT NULL,
    image_location TEXT
);

CREATE TABLE IF NOT EXISTS Basket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skin_name TEXT NOT NULL,
    quantity INT,
    userId INT NOT NULL,
    productId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES skins(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review TEXT NOT NULL,
    grade FLOAT NOT NULL,
    userId INT NOT NULL,
    productId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES skins(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    cost INT NOT NULL,
    ord_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,    
    username VARCHAR(50) NOT NULL,
    userId INT NOT NULL,
    expiration_time TIMESTAMP NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

