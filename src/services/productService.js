import { Product } from '../models/index.js';

export const getAllProducts = async () => {
  return await Product.findAll({
    attributes: ['id', 'name', 'sku'],
    order: [['id', 'ASC']]
  });
};
