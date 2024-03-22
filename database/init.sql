CREATE DATABASE IF NOT EXISTS prueba_go;
USE prueba_go;

CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ram INT,
    cpu INT
);
CREATE TABLE IF NOT EXISTS process_op (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pid INT,
    operation INT
);
