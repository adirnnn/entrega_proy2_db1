// backend/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'luxor_db',
  process.env.POSTGRES_USER || 'proy3',
  process.env.POSTGRES_PASSWORD || 'secret',
  {
    host: process.env.POSTGRES_HOST || 'db',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: false, // console.log para ver las queries
  }
);

export default sequelize;