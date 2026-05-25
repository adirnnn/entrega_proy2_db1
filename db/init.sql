-- DDL Script
CREATE TABLE proveedor (
    id_proveedor INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE producto (
    id_producto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL CHECK (stock >= 0),
    id_proveedor INT NOT NULL,
    CONSTRAINT fk_producto_proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);

CREATE TABLE cliente (
    id_cliente INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20)
);

CREATE TABLE empleado (
    id_empleado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    puesto VARCHAR(50) NOT NULL,
    salario DECIMAL(10,2) NOT NULL CHECK (salario > 0)
);

CREATE TABLE venta (
    id_venta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT fk_venta_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

CREATE TABLE detalle_venta (
    id_detalle INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'basic_role'
);

-- Indexes
CREATE INDEX idx_producto_categoria ON producto(categoria);
CREATE INDEX idx_venta_fecha ON venta(fecha);

-- VIEW
CREATE OR REPLACE VIEW vista_ventas_completas AS
SELECT 
    v.id_venta,
    v.fecha,
    c.nombre AS cliente,
    e.nombre AS empleado,
    p.nombre AS producto,
    p.categoria,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario) AS subtotal
FROM venta v
JOIN cliente c ON v.id_cliente = c.id_cliente
JOIN empleado e ON v.id_empleado = e.id_empleado
JOIN detalle_venta dv ON v.id_venta = dv.id_venta
JOIN producto p ON dv.id_producto = p.id_producto;

-- SEED DATA

INSERT INTO users (name, email, password, role) VALUES
('Admin Luxor', 'admin@luxor.com', 'admin123', 'admin_role'),
('Manager Luxor', 'manager@luxor.com', 'manager123', 'manager_role'),
('Ventas Luxor', 'sales@luxor.com', 'sales123', 'sales_role'),
('Inventario Luxor', 'inventory@luxor.com', 'inv123', 'inventory_role'),
('Cliente Luxor', 'client@luxor.com', 'client123', 'basic_role');

-- 25+ Proveedores
INSERT INTO proveedor (nombre, contacto, telefono) VALUES
('Afnan Perfumes', 'Ahmed', '123456'), ('Lattafa Perfumes', 'Yusuf', '654321'), ('Al Haramain', 'Zaid', '111222'),
('Rasasi', 'Omar', '333444'), ('Armaf', 'Khalid', '555666'), ('Swiss Arabian', 'Hassan', '777888'),
('Fragrance World', 'Said', '999000'), ('Ajmal', 'Imran', '121212'), ('Nishane', 'Mert', '343434'),
('Xerjoff', 'Sergio', '565656'), ('Roja Dove', 'Roja', '787878'), ('Amouage', 'Sayyid', '909090'),
('Montale', 'Pierre', '123123'), ('Mancera', 'Pierre', '456456'), ('Byredo', 'Ben', '789789'),
('Diptyque', 'Yves', '012012'), ('Creed', 'Erwin', '345345'), ('Tom Ford', 'Tom', '678678'),
('Parfums de Marly', 'Julien', '901901'), ('Initio', 'Nadia', '232323'), ('Kilian', 'Kilian', '454545'),
('Maison Francis Kurkdjian', 'Francis', '676767'), ('Penhaligon s', 'William', '898989'), ('Memo Paris', 'Clara', '101010'),
('Le Labo', 'Eddie', '202020'), ('By Kilian', 'Hennessy', '303030');

-- 25+ Clientes
INSERT INTO cliente (nombre, correo, telefono) VALUES
('Juan Perez', 'juan@test.com', '1001'), ('Maria Garcia', 'maria@test.com', '1002'), ('Carlos Lopez', 'carlos@test.com', '1003'),
('Ana Martinez', 'ana@test.com', '1004'), ('Luis Rodriguez', 'luis@test.com', '1005'), ('Elena Sanchez', 'elena@test.com', '1006'),
('Pedro Gomez', 'pedro@test.com', '1007'), ('Laura Diaz', 'laura@test.com', '1008'), ('Diego Ruiz', 'diego@test.com', '1009'),
('Marta Torres', 'marta@test.com', '1010'), ('Jorge Morales', 'jorge@test.com', '1011'), ('Sofia Castro', 'sofia@test.com', '1012'),
('Raul Ortiz', 'raul@test.com', '1013'), ('Carmen Silva', 'carmen@test.com', '1014'), ('Oscar Ramos', 'oscar@test.com', '1015'),
('Lucia Mendoza', 'lucia@test.com', '1016'), ('David Flores', 'david@test.com', '1017'), ('Isabel Romero', 'isabel@test.com', '1018'),
('Hugo Gutierrez', 'hugo@test.com', '1019'), ('Paula Navarro', 'paula@test.com', '1020'), ('Andres Suarez', 'andres@test.com', '1021'),
('Beatriz Reyes', 'beatriz@test.com', '1022'), ('Ramon Jimenez', 'ramon@test.com', '1023'), ('Julia Vidal', 'julia@test.com', '1024'),
('Mario Salazar', 'mario@test.com', '1025'), ('Patricia Pardo', 'patricia@test.com', '1026');

-- 25+ Empleados
INSERT INTO empleado (nombre, puesto, salario) VALUES
('Vendedor 1', 'Vendedor', 1500), ('Vendedor 2', 'Vendedor', 1500), ('Vendedor 3', 'Vendedor', 1500),
('Vendedor 4', 'Vendedor', 1500), ('Vendedor 5', 'Vendedor', 1500), ('Vendedor 6', 'Vendedor', 1500),
('Vendedor 7', 'Vendedor', 1500), ('Vendedor 8', 'Vendedor', 1500), ('Vendedor 9', 'Vendedor', 1500),
('Vendedor 10', 'Vendedor', 1500), ('Vendedor 11', 'Vendedor', 1500), ('Vendedor 12', 'Vendedor', 1500),
('Vendedor 13', 'Vendedor', 1500), ('Vendedor 14', 'Vendedor', 1500), ('Vendedor 15', 'Vendedor', 1500),
('Vendedor 16', 'Vendedor', 1500), ('Vendedor 17', 'Vendedor', 1500), ('Vendedor 18', 'Vendedor', 1500),
('Vendedor 19', 'Vendedor', 1500), ('Vendedor 20', 'Vendedor', 1500), ('Admin Ventas', 'Supervisor', 2500),
('Gerente Luxor', 'Gerente', 4000), ('Asistente 1', 'Asistente', 1200), ('Asistente 2', 'Asistente', 1200),
('Limpieza 1', 'Mantenimiento', 1000), ('Seguridad 1', 'Seguridad', 1100);

-- 25+ Productos
INSERT INTO producto (nombre, categoria, precio, stock, id_proveedor) VALUES
('9PM', 'Dulce', 450, 20, 1), ('Khamrah', 'Gourmand', 500, 15, 2), ('Amber Oud Gold', 'Oriental', 650, 10, 3),
('Hawas', 'Acuatico', 480, 25, 4), ('Club de Nuit Intense', 'Citrico', 420, 30, 5), ('Aventus', 'Chipre', 3500, 5, 17),
('Layton', 'Oriental', 2800, 8, 19), ('Baccarat Rouge 540', 'Floral', 4000, 3, 22), ('Sauvage', 'Fougere', 1500, 12, 1),
('Bleu de Chanel', 'Amaderado', 1600, 10, 2), ('The One', 'Especiado', 1200, 15, 3), ('Acqua di Gio', 'Citrico', 1100, 20, 4),
('Yara', 'Femenino', 350, 40, 2), ('Fakhar', 'Floral', 380, 25, 2), ('Oud Mood', 'Incienso', 300, 30, 2),
('Asad', 'Especiado', 400, 20, 2), ('Detour Noir', 'Dulce', 390, 15, 1), ('Toy Boy', 'Rosa', 900, 10, 3),
('Light Blue', 'Citrico', 850, 18, 4), ('Eros', 'Dulce', 1100, 12, 5), ('Cool Water', 'Acuatico', 600, 25, 6),
('Interlude', 'Incienso', 3200, 4, 12), ('Black Phantom', 'Gourmand', 2900, 6, 21), ('Delina', 'Rosa', 2700, 7, 13),
('Hacivat', 'Piña', 2500, 9, 9), ('Side Effect', 'Canela', 3100, 5, 20);

-- Dummy Ventas para poblar reportes
INSERT INTO venta (id_cliente, id_empleado, total) VALUES
(1, 1, 450), (2, 2, 500), (3, 3, 650), (4, 4, 480), (5, 5, 420),
(1, 6, 3500), (2, 7, 2800), (3, 8, 4000), (4, 9, 1500), (5, 10, 1600);

-- Dummy Detalles de Venta
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 1, 450), (2, 2, 1, 500), (3, 3, 1, 650), (4, 4, 1, 480), (5, 5, 1, 420),
(6, 6, 1, 3500), (7, 7, 1, 2800), (8, 8, 1, 4000), (9, 9, 1, 1500), (10, 10, 1, 1600);

-- STORED PROCEDURES
-- 1. sp_create_sale
CREATE OR REPLACE PROCEDURE sp_create_sale(
    p_id_cliente INT,
    p_id_empleado INT,
    p_productos JSON,
    OUT p_total DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_venta INT;
    v_prod JSON;
    v_precio DECIMAL;
    v_subtotal DECIMAL;
    v_total DECIMAL := 0;
    v_stock INT;
BEGIN
    INSERT INTO venta (id_cliente, id_empleado, total)
    VALUES (p_id_cliente, p_id_empleado, 0)
    RETURNING id_venta INTO v_id_venta;

    FOR v_prod IN SELECT * FROM json_array_elements(p_productos)
    LOOP
        SELECT precio, stock INTO v_precio, v_stock 
        FROM producto WHERE id_producto = (v_prod->>'id_producto')::INT;
        
        IF v_stock < (v_prod->>'cantidad')::INT THEN
            RAISE EXCEPTION 'Stock insuficiente para el producto %', (v_prod->>'id_producto')::INT;
        END IF;

        v_subtotal := v_precio * (v_prod->>'cantidad')::INT;
        v_total := v_total + v_subtotal;

        INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
        VALUES (v_id_venta, (v_prod->>'id_producto')::INT, (v_prod->>'cantidad')::INT, v_precio);

        UPDATE producto 
        SET stock = stock - (v_prod->>'cantidad')::INT
        WHERE id_producto = (v_prod->>'id_producto')::INT;
    END LOOP;

    UPDATE venta SET total = v_total WHERE id_venta = v_id_venta;
    p_total := v_total;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;

-- 2. sp_add_product
CREATE OR REPLACE PROCEDURE sp_add_product(
    p_nombre VARCHAR,
    p_categoria VARCHAR,
    p_precio DECIMAL,
    p_stock INT,
    p_id_proveedor INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO producto (nombre, categoria, precio, stock, id_proveedor)
    VALUES (p_nombre, p_categoria, p_precio, p_stock, p_id_proveedor);
END;
$$;

-- 3. sp_update_stock
CREATE OR REPLACE PROCEDURE sp_update_stock(
    p_id_producto INT,
    p_cantidad INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_stock INT;
BEGIN
    SELECT stock INTO v_current_stock FROM producto WHERE id_producto = p_id_producto;
    
    IF v_current_stock + p_cantidad < 0 THEN
        RAISE EXCEPTION 'No se puede reducir el stock por debajo de 0';
    END IF;

    UPDATE producto SET stock = stock + p_cantidad WHERE id_producto = p_id_producto;
END;
$$;

-- 4. sp_delete_client
CREATE OR REPLACE PROCEDURE sp_delete_client(
    p_id_cliente INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_sales_count INT;
BEGIN
    SELECT COUNT(*) INTO v_sales_count FROM venta WHERE id_cliente = p_id_cliente;
    
    IF v_sales_count > 0 THEN
        RAISE EXCEPTION 'No se puede eliminar el cliente porque tiene ventas asociadas';
    END IF;

    DELETE FROM cliente WHERE id_cliente = p_id_cliente;
END;
$$;

-- 5. sp_get_employee_sales
CREATE OR REPLACE PROCEDURE sp_get_employee_sales(
    IN p_id_empleado INT,
    OUT p_total_ventas INT,
    OUT p_suma_total DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*), COALESCE(SUM(total), 0)
    INTO p_total_ventas, p_suma_total
    FROM venta
    WHERE id_empleado = p_id_empleado;
END;
$$;

-- CREATION OF ROLES
CREATE ROLE admin_role;
CREATE ROLE manager_role;
CREATE ROLE sales_role;
CREATE ROLE inventory_role;
CREATE ROLE basic_role;

GRANT admin_role, manager_role, sales_role, inventory_role, basic_role TO proy3;

-- PRIVILEGES (GRANT/REVOKE)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE EXECUTE ON ALL ROUTINES IN SCHEMA public FROM PUBLIC;

-- admin_role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_role;
GRANT EXECUTE ON PROCEDURE sp_create_sale(INT, INT, JSON) TO admin_role;
GRANT EXECUTE ON PROCEDURE sp_add_product(VARCHAR, VARCHAR, DECIMAL, INT, INT) TO admin_role;
GRANT EXECUTE ON PROCEDURE sp_update_stock(INT, INT) TO admin_role;
GRANT EXECUTE ON PROCEDURE sp_delete_client(INT) TO admin_role;
GRANT EXECUTE ON PROCEDURE sp_get_employee_sales(INT) TO admin_role;

-- manager_role
GRANT SELECT ON ALL TABLES IN SCHEMA public TO manager_role;
GRANT UPDATE, INSERT, DELETE ON empleado TO manager_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO manager_role;
GRANT EXECUTE ON PROCEDURE sp_get_employee_sales(INT) TO manager_role;
GRANT EXECUTE ON PROCEDURE sp_delete_client(INT) TO manager_role;

-- sales_role
GRANT SELECT ON producto, cliente, empleado, proveedor, venta, detalle_venta, vista_ventas_completas TO sales_role;
GRANT INSERT, UPDATE ON venta, detalle_venta, cliente TO sales_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sales_role;
GRANT EXECUTE ON PROCEDURE sp_create_sale(INT, INT, JSON) TO sales_role;
GRANT EXECUTE ON PROCEDURE sp_delete_client(INT) TO sales_role;

-- inventory_role
GRANT SELECT ON ALL TABLES IN SCHEMA public TO inventory_role;
GRANT INSERT, UPDATE, DELETE ON producto, proveedor TO inventory_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO inventory_role;
GRANT EXECUTE ON PROCEDURE sp_add_product(VARCHAR, VARCHAR, DECIMAL, INT, INT) TO inventory_role;
GRANT EXECUTE ON PROCEDURE sp_update_stock(INT, INT) TO inventory_role;

-- basic_role
GRANT SELECT ON producto, proveedor, vista_ventas_completas TO basic_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO basic_role;
