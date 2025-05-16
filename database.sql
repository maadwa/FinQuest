USE user_auth;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255)
);

