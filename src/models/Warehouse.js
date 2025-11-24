import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'warehouses',
  timestamps: true
});

export default Warehouse;
