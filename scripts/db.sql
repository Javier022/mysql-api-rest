CREATE DATABASE IF NOT EXISTS tasksdb 

USE tasksdb

CREATE TABLE IF NOT EXISTS users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(100) NOT NULL,
  fullname varchar(255),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  state BOOLEAN NOT NULL DEFAULT true,
  rol_id INT(11) NOT NULL,
  CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES roles(id),
  PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS tasks (
  id INT(11) NOT NULL AUTO_INCREMENT,
  title varchar(100) NOT NULL,
  description text,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  user_id INT(11) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS  roles (
  id INT(11)  NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  PRIMARY KEY(id)
);



ALTER TABLE users 
  ADD country varchar(100) 
  ADD about varchar(255) 
 
  

-- CONSTRAINT para indicar que un determinado campo debe de cumplir 
-- con las indicaciones requeridas para que la accion no se cancele


-- see table
DESCRIBE  table_name

INSERT INTO users (username, email, password) VALUES 
  ('test', 'only@test.com', '12345678');


INSERT INTO tasks (title, description, user_id) VALUES 
  ('task 1', 'only test', 1);


  INSERT INTO tasks (title, description, user_id) VALUES 
  ('task 2', 'only test', 1);