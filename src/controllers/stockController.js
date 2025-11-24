import * as stockService from '../services/stockService.js';

export const getStocks = async (req, res, next) => {
  try {
    const stocks = await stockService.getAllStocks();
    
    res.json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};
