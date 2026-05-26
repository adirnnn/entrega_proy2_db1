import { DataTypes } from 'sequelize';
import sequelize from './db.js';

export const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  contacto: { type: DataTypes.STRING(100) },
  telefono: { type: DataTypes.STRING(20) }
}, {
  tableName: 'proveedor',
  timestamps: false
});

export const Producto = sequelize.define('Producto', {
  id_producto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  categoria: { type: DataTypes.STRING(50), allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false },
  id_proveedor: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'producto',
  timestamps: false
});

export const Cliente = sequelize.define('Cliente', {
  id_cliente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  correo: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING(20) }
}, {
  tableName: 'cliente',
  timestamps: false
});

export const Empleado = sequelize.define('Empleado', {
  id_empleado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  puesto: { type: DataTypes.STRING(50), allowNull: false },
  salario: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'empleado',
  timestamps: false
});

export const Venta = sequelize.define('Venta', {
  id_venta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_cliente: { type: DataTypes.INTEGER, allowNull: false },
  id_empleado: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
}, {
  tableName: 'venta',
  timestamps: false
});

export const DetalleVenta = sequelize.define('DetalleVenta', {
  id_detalle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_venta: { type: DataTypes.INTEGER, allowNull: false },
  id_producto: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'detalle_venta',
  timestamps: false
});

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.STRING(20), defaultValue: 'basic_role' }
}, {
  tableName: 'users',
  timestamps: false
});

// Relationships
Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedorDetails' });
Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor' });

Venta.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Cliente.hasMany(Venta, { foreignKey: 'id_cliente' });

Venta.belongsTo(Empleado, { foreignKey: 'id_empleado' });
Empleado.hasMany(Venta, { foreignKey: 'id_empleado' });

DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta' });
Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta' });

DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto' });
Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto' });

export default {
  Proveedor,
  Producto,
  Cliente,
  Empleado,
  Venta,
  DetalleVenta,
  User
};
