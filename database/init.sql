CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    user_id INT
);

CREATE TABLE IF NOT EXISTS skins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    category TEXT,
    value FLOAT,
    reviews JSON,
    prouct_id INT
);

CREATE TABLE IF NOT EXISTS Basket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantity INT,
    products JSON,
    userId INT,
    productId INT,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES skins(id)
);

