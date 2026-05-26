import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sequelize from "./db.js";
import { Producto, Cliente, Proveedor, Empleado, Venta, DetalleVenta, User } from "./models.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conectado a PostgreSQL con Sequelize');
      break;
    } catch (err) {
      console.log('⏳ Esperando a la base de datos...', err.message);
      retries -= 1;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};
connectWithRetry();

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

const requireRole = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const withTransaction = async (role, callback) => {
  return await sequelize.transaction(async (t) => {
    await sequelize.query(`SET LOCAL ROLE ${role};`, { transaction: t });
    return await callback(t);
  });
};

app.get("/products", requireRole, async (req, res) => {
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await Producto.findAll({
        include: [{ model: Proveedor, as: 'proveedorDetails', attributes: ['nombre'] }],
        order: [['id_producto', 'ASC']],
        transaction: t,
        raw: true,
        nest: true
      });
    });
    const mapped = result.map(p => ({
      ...p,
      proveedor: p.proveedorDetails?.nombre || 'Unknown'
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/products", requireRole, async (req, res) => {
  const { nombre, categoria, precio, stock, id_proveedor } = req.body;
  try {
    await withTransaction(req.user.role, async (t) => {
      await sequelize.query(
        'CALL sp_add_product(:nombre, :categoria, :precio, :stock, :id_proveedor)',
        {
          replacements: { nombre, categoria, precio, stock, id_proveedor },
          transaction: t
        }
      );
    });
    res.json({ message: "Product created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/products/:id", requireRole, async (req, res) => {
  try {
    await withTransaction(req.user.role, async (t) => {
      await Producto.destroy({ where: { id_producto: req.params.id }, transaction: t });
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/clients", requireRole, async (req, res) => {
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await Cliente.findAll({ order: [['id_cliente', 'ASC']], transaction: t });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/clients", requireRole, async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await Cliente.create({ nombre, correo, telefono }, { transaction: t });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/clients/:id", requireRole, async (req, res) => {
  try {
    await withTransaction(req.user.role, async (t) => {
      await sequelize.query('CALL sp_delete_client(:id_cliente)', {
        replacements: { id_cliente: req.params.id },
        transaction: t
      });
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/providers", requireRole, async (req, res) => {
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await Proveedor.findAll({ order: [['id_proveedor', 'ASC']], transaction: t });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sales", requireRole, async (req, res) => {
  const { id_cliente, id_empleado, productos } = req.body;
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      const output = await sequelize.query(
        'CALL sp_create_sale(:id_cliente, :id_empleado, :productos, NULL)',
        {
          replacements: { id_cliente, id_empleado, productos: JSON.stringify(productos) },
          transaction: t
        }
      );
      return output;
    });
    res.json({ message: "Sale created", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/products/:id/stock", requireRole, async (req, res) => {
  const { cantidad } = req.body;
  try {
    await withTransaction(req.user.role, async (t) => {
      await sequelize.query(
        'CALL sp_update_stock(:id_producto, :cantidad)',
        {
          replacements: { id_producto: req.params.id, cantidad },
          transaction: t
        }
      );
    });
    res.json({ message: "Stock updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports/top-categories", requireRole, async (req, res) => {
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await sequelize.query(`
        SELECT categoria, COUNT(id_producto) as total_productos, AVG(precio) as precio_promedio
        FROM producto
        GROUP BY categoria
        HAVING COUNT(id_producto) >= 1
      `, { type: sequelize.QueryTypes.SELECT, transaction: t });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports/sold-products", requireRole, async (req, res) => {
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await sequelize.query(`
        SELECT id_producto, nombre, precio 
        FROM producto 
        WHERE id_producto IN (SELECT DISTINCT id_producto FROM detalle_venta)
      `, { type: sequelize.QueryTypes.SELECT, transaction: t });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports/active-clients", requireRole, async (req, res) => {
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await sequelize.query(`
        SELECT c.id_cliente, c.nombre 
        FROM cliente c 
        WHERE EXISTS (SELECT 1 FROM venta v WHERE v.id_cliente = c.id_cliente)
      `, { type: sequelize.QueryTypes.SELECT, transaction: t });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reports/employee-sales", requireRole, async (req, res) => {
  try {
    const result = await withTransaction(req.user.role, async (t) => {
      return await sequelize.query(`
        WITH EmployeeSales AS (
          SELECT id_empleado, COUNT(id_venta) as total_ventas, SUM(total) as suma_total
          FROM venta
          GROUP BY id_empleado
        )
        SELECT e.nombre, e.puesto, COALESCE(es.total_ventas, 0) as total_ventas, COALESCE(es.suma_total, 0) as suma_total
        FROM empleado e
        LEFT JOIN EmployeeSales es ON e.id_empleado = es.id_empleado
        ORDER BY suma_total DESC
      `, { type: sequelize.QueryTypes.SELECT, transaction: t });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});