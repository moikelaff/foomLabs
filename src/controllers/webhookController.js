import * as webhookService from '../services/webhookService.js';

export const receiveStock = async (req, res, next) => {
  try {
    const result = await webhookService.receiveStock(req.body);
    
    res.json({
      success: true,
      message: result.message,
      data: {
        reference: result.purchaseRequest.reference,
        status: result.purchaseRequest.status,
        alreadyProcessed: result.alreadyProcessed
      }
    });
  } catch (error) {
    next(error);
  }
};
