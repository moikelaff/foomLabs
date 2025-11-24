import express from 'express';
import * as purchaseRequestController from '../controllers/purchaseRequestController.js';

const router = express.Router();

router.get('/', purchaseRequestController.getPurchaseRequests);
router.get('/:id', purchaseRequestController.getPurchaseRequestById);
router.post('/', purchaseRequestController.createPurchaseRequest);

export default router;
