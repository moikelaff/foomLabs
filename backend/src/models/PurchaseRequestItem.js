import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PurchaseRequestItem = sequelize.define('PurchaseRequestItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchase_request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchase_requests',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'purchase_request_items',
  timestamps: true
});

export default PurchaseRequestItem;
