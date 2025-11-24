import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PurchaseRequest = sequelize.define('PurchaseRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'warehouses',
      key: 'id'
    }
  },
  vendor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PENDING', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'DRAFT'
  }
}, {
  tableName: 'purchase_requests',
  timestamps: true
});

export default PurchaseRequest;
