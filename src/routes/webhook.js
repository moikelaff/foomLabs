import express from 'express';
import * as webhookController from '../controllers/webhookController.js';
import { validateWebhookReceiveStock } from '../middlewares/validation.js';

const router = express.Router();

router.post('/receive-stock', validateWebhookReceiveStock, webhookController.receiveStock);

export default router;
