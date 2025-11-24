import sequelize from '../config/database.js';
import Warehouse from './Warehouse.js';
import Product from './Product.js';
import Stock from './Stock.js';
import PurchaseRequest from './PurchaseRequest.js';
import PurchaseRequestItem from './PurchaseRequestItem.js';

// Define associations
Stock.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });
Stock.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

PurchaseRequest.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });
PurchaseRequest.hasMany(PurchaseRequestItem, { foreignKey: 'purchase_request_id', as: 'items', onDelete: 'CASCADE' });

PurchaseRequestItem.belongsTo(PurchaseRequest, { foreignKey: 'purchase_request_id', as: 'purchaseRequest' });
PurchaseRequestItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

testConnection();

export {
  sequelize,
  Warehouse,
  Product,
  Stock,
  PurchaseRequest,
  PurchaseRequestItem
};
