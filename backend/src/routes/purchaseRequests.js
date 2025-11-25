import express from 'express';
import * as purchaseRequestController from '../controllers/purchaseRequestController.js';
import { validateCreatePurchaseRequest, validateUpdatePurchaseRequest } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', purchaseRequestController.getPurchaseRequests);
router.get('/:id', purchaseRequestController.getPurchaseRequestById);
router.post('/', validateCreatePurchaseRequest, purchaseRequestController.createPurchaseRequest);
router.put('/:id', validateUpdatePurchaseRequest, purchaseRequestController.updatePurchaseRequest);
router.delete('/:id', purchaseRequestController.deletePurchaseRequest);

export default router;
