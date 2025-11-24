import * as productService from '../services/productService.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
