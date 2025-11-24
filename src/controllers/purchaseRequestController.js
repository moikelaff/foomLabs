import * as purchaseRequestService from '../services/purchaseRequestService.js';

export const createPurchaseRequest = async (req, res, next) => {
  try {
    const purchaseRequest = await purchaseRequestService.createPurchaseRequest(req.body);
    
    res.status(201).json({
      success: true,
      data: purchaseRequest
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseRequests = async (req, res, next) => {
  try {
    const purchaseRequests = await purchaseRequestService.getAllPurchaseRequests();
    
    res.json({
      success: true,
      data: purchaseRequests
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseRequestById = async (req, res, next) => {
  try {
    const purchaseRequest = await purchaseRequestService.getPurchaseRequestById(req.params.id);
    
    res.json({
      success: true,
      data: purchaseRequest
    });
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseRequest = async (req, res, next) => {
  try {
    const purchaseRequest = await purchaseRequestService.updatePurchaseRequest(req.params.id, req.body);
    
    res.json({
      success: true,
      data: purchaseRequest
    });
  } catch (error) {
    next(error);
  }
};

export const deletePurchaseRequest = async (req, res, next) => {
  try {
    const result = await purchaseRequestService.deletePurchaseRequest(req.params.id);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
