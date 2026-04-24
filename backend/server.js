import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     process.env.POSTGRES_HOST || 'db',
  port:     process.env.POSTGRES_PORT || 5432,
  user:     process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// Helper to wait for DB
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Conectado a PostgreSQL');
      break;
    } catch (err) {
      console.log('⏳ Esperando a la base de datos...');
      retries -= 1;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};
connectWithRetry();

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const user = result.rows[0];
    return res.json({ success: true, token: "db-token", user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- CRUD: Productos (JOIN 1) ---
app.get("/products", async (req, res) => {
  try {
    const query = `
      SELECT p.id_producto, p.nombre, p.categoria, p.precio, p.stock, pr.nombre AS proveedor
      FROM producto p
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      ORDER BY p.id_producto ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", async (req, res) => {
  const { nombre, categoria, precio, stock, id_proveedor } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO producto (nombre, categoria, precio, stock, id_proveedor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, categoria, precio, stock, id_proveedor]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await pool.query('DELETE FROM producto WHERE id_producto=$1', [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CRUD: Clientes ---
app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cliente ORDER BY id_cliente ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/clients", async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cliente (nombre, correo, telefono) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, telefono]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/clients/:id", async (req, res) => {
  try {
    await pool.query('DELETE FROM cliente WHERE id_cliente=$1', [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/providers", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedor ORDER BY id_proveedor ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- REPORTS ---

app.get("/reports/top-categories", async (req, res) => {
  try {
    const query = `
      SELECT categoria, COUNT(id_producto) as total_productos, AVG(precio) as precio_promedio
      FROM producto
      GROUP BY categoria
      HAVING COUNT(id_producto) >= 1
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports/sold-products", async (req, res) => {
  try {
    const query = `
      SELECT id_producto, nombre, precio 
      FROM producto 
      WHERE id_producto IN (SELECT DISTINCT id_producto FROM detalle_venta)
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports/active-clients", async (req, res) => {
  try {
    const query = `
      SELECT c.id_cliente, c.nombre 
      FROM cliente c 
      WHERE EXISTS (SELECT 1 FROM venta v WHERE v.id_cliente = c.id_cliente)
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports/employee-sales", async (req, res) => {
  try {
    const query = `
      WITH EmployeeSales AS (
        SELECT id_empleado, COUNT(id_venta) as total_ventas, SUM(total) as suma_total
        FROM venta
        GROUP BY id_empleado
      )
      SELECT e.nombre, e.puesto, COALESCE(es.total_ventas, 0) as total_ventas, COALESCE(es.suma_total, 0) as suma_total
      FROM empleado e
      LEFT JOIN EmployeeSales es ON e.id_empleado = es.id_empleado
      ORDER BY suma_total DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});