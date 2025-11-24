import { Stock, Warehouse, Product } from '../models/index.js';

export const getAllStocks = async () => {
  return await Stock.findAll({
    include: [
      {
        model: Warehouse,
        as: 'warehouse',
        attributes: ['id', 'name']
      },
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku']
      }
    ],
    order: [['id', 'ASC']]
  });
};
