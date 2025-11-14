
create database hackathon;
use hackathon;
create table users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(20),
        last_name VARCHAR(20),
        email VARCHAR(50) UNIQUE,
        password VARCHAR(255),
        mobile VARCHAR(10),
        birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);

create table reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id INT, 
        review VARCHAR(255) not null,
        user_id INT,
        FOREIGN KEY (user_id) references users(id),
        modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);

create table movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table shares (
        user_id INT,
        review_id INT,
        FOREIGN KEY (review_id) references reviews(id),
        FOREIGN KEY (user_id) references users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);