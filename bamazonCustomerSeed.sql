DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price FLOAT(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('mouse', 'computer accessories', 19.99, 200),
('mousepad', 'computer accessories', 8.99, 2000),
('headphones', 'electronics', 79.99, 50),
('coffee grinder', 'kitchen', 18.99, 100),
('microwave', 'kitchen', 119.99, 30),
('swim goggles', 'sports', 12.99, 150),
('wireless keyboard', 'computer accessories', 23.99, 20),
('running shoes', 'sports', 34.99, 30),
('desktop monitor', 'computer accessories', 54.10, 5),
('frying pan', 'kitchen', 29.43, 500);

-- SELECT * FROM products;
