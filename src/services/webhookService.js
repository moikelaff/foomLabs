import { sequelize, PurchaseRequest, Stock } from '../models/index.js';

export const receiveStock = async (data) => {
  const { reference, items } = data;

  const transaction = await sequelize.transaction();

  try {
    // Find purchase request by reference
    const purchaseRequest = await PurchaseRequest.findOne({
      where: { reference },
      transaction
    });

    if (!purchaseRequest) {
      const error = new Error(`Purchase request with reference ${reference} not found`);
      error.status = 404;
      throw error;
    }

    // Idempotency check: if already COMPLETED, don't process again
    if (purchaseRequest.status === 'COMPLETED') {
      await transaction.commit();
      return {
        message: 'Stock already received for this purchase request',
        alreadyProcessed: true,
        purchaseRequest
      };
    }

    // Validate status is PENDING
    if (purchaseRequest.status !== 'PENDING') {
      const error = new Error(`Purchase request status must be PENDING. Current status: ${purchaseRequest.status}`);
      error.status = 400;
      throw error;
    }

    // Process each item and update stock
    for (const item of items) {
      const { product_id, quantity } = item;

      // Find existing stock or create new
      const [stock, created] = await Stock.findOrCreate({
        where: {
          warehouse_id: purchaseRequest.warehouse_id,
          product_id: product_id
        },
        defaults: {
          warehouse_id: purchaseRequest.warehouse_id,
          product_id: product_id,
          quantity: 0
        },
        transaction
      });

      // Add received quantity to existing stock
      stock.quantity += quantity;
      await stock.save({ transaction });
    }

    // Update purchase request status to COMPLETED
    purchaseRequest.status = 'COMPLETED';
    await purchaseRequest.save({ transaction });

    await transaction.commit();

    return {
      message: 'Stock received successfully',
      alreadyProcessed: false,
      purchaseRequest
    };
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};
