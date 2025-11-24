import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  const sequelize = new Sequelize({
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres'
  });

  const dbName = process.env.DB_NAME || 'inventory_db';

  try {
    await sequelize.query(`CREATE DATABASE ${dbName};`);
    console.log(`✅ Database '${dbName}' created successfully`);
  } catch (error) {
    if (error.parent?.code === '42P04') {
      console.log(`ℹ️  Database '${dbName}' already exists`);
    } else {
      console.error('❌ Error creating database:', error.message);
      process.exit(1);
    }
  } finally {
    await sequelize.close();
  }
};

createDatabase();
