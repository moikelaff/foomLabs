import express from 'express';
import * as webhookController from '../controllers/webhookController.js';

const router = express.Router();

router.post('/receive-stock', webhookController.receiveStock);

export default router;
