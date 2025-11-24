import express from 'express';
import * as purchaseRequestController from '../controllers/purchaseRequestController.js';

const router = express.Router();

router.get('/', purchaseRequestController.getPurchaseRequests);
router.get('/:id', purchaseRequestController.getPurchaseRequestById);
router.post('/', purchaseRequestController.createPurchaseRequest);
router.put('/:id', purchaseRequestController.updatePurchaseRequest);
router.delete('/:id', purchaseRequestController.deletePurchaseRequest);

export default router;
