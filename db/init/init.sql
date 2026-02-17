CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (name, email, age) VALUES
('Ana López', 'ana@correo.com', 20),
('Juan Pérez', 'juan@correo.com', 22),
('María García', 'maria@correo.com', 19),
('Carlos Ruiz', 'carlos@correo.com', 23);
