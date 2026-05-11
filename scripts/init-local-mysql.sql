CREATE DATABASE IF NOT EXISTS demo_app;

CREATE USER IF NOT EXISTS 'demo_user'@'localhost' IDENTIFIED BY 'demo_password';
GRANT ALL PRIVILEGES ON demo_app.* TO 'demo_user'@'localhost';

FLUSH PRIVILEGES;
