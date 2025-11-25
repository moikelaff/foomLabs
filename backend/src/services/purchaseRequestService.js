import { sequelize, PurchaseRequest, PurchaseRequestItem, Warehouse, Product } from '../models/index.js';
import { generateReference } from '../utils/referenceGenerator.js';
import { callHubApi } from '../utils/hubApi.js';

export const createPurchaseRequest = async (data) => {
  const { warehouse_id, vendor, items } = data;

  // Validate warehouse exists
  const warehouse = await Warehouse.findByPk(warehouse_id);
  if (!warehouse) {
    const error = new Error('Warehouse not found');
    error.status = 404;
    throw error;
  }

  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Items array is required and must not be empty');
    error.status = 400;
    throw error;
  }

  // Validate all products exist
  for (const item of items) {
    const product = await Product.findByPk(item.product_id);
    if (!product) {
      const error = new Error(`Product with id ${item.product_id} not found`);
      error.status = 404;
      throw error;
    }
    if (!item.quantity || item.quantity <= 0) {
      const error = new Error('Quantity must be greater than 0');
      error.status = 400;
      throw error;
    }
  }

  // Generate unique reference
  const reference = await generateReference();

  // Use transaction for ACID compliance
  const transaction = await sequelize.transaction();

  try {
    // Create purchase request with DRAFT status
    const purchaseRequest = await PurchaseRequest.create({
      reference,
      warehouse_id,
      vendor,
      status: 'DRAFT'
    }, { transaction });

    // Create purchase request items
    const itemsData = items.map(item => ({
      purchase_request_id: purchaseRequest.id,
      product_id: item.product_id,
      quantity: item.quantity
    }));

    await PurchaseRequestItem.bulkCreate(itemsData, { transaction });

    await transaction.commit();

    // Fetch complete purchase request with items
    const result = await PurchaseRequest.findByPk(purchaseRequest.id, {
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name']
        },
        {
          model: PurchaseRequestItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku']
            }
          ]
        }
      ]
    });

    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getAllPurchaseRequests = async () => {
  return await PurchaseRequest.findAll({
    include: [
      {
        model: Warehouse,
        as: 'warehouse',
        attributes: ['id', 'name']
      },
      {
        model: PurchaseRequestItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku']
          }
        ]
      }
    ],
    order: [['id', 'DESC']]
  });
};

export const getPurchaseRequestById = async (id) => {
  const purchaseRequest = await PurchaseRequest.findByPk(id, {
    include: [
      {
        model: Warehouse,
        as: 'warehouse',
        attributes: ['id', 'name']
      },
      {
        model: PurchaseRequestItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'sku']
          }
        ]
      }
    ]
  });

  if (!purchaseRequest) {
    const error = new Error('Purchase request not found');
    error.status = 404;
    throw error;
  }

  return purchaseRequest;
};

export const updatePurchaseRequest = async (id, data) => {
  const { warehouse_id, vendor, status, items } = data;

  const transaction = await sequelize.transaction();

  try {
    // Find existing purchase request
    const purchaseRequest = await PurchaseRequest.findByPk(id, {
      include: [
        {
          model: PurchaseRequestItem,
          as: 'items'
        }
      ],
      transaction
    });

    if (!purchaseRequest) {
      const error = new Error('Purchase request not found');
      error.status = 404;
      throw error;
    }

    // Validate: updates only allowed when status is DRAFT
    if (purchaseRequest.status !== 'DRAFT') {
      const error = new Error('Cannot update purchase request. Only DRAFT status can be modified.');
      error.status = 400;
      throw error;
    }

    const oldStatus = purchaseRequest.status;
    const newStatus = status || oldStatus;

    // Update warehouse if provided
    if (warehouse_id) {
      const warehouse = await Warehouse.findByPk(warehouse_id);
      if (!warehouse) {
        const error = new Error('Warehouse not found');
        error.status = 404;
        throw error;
      }
      purchaseRequest.warehouse_id = warehouse_id;
    }

    // Update vendor if provided
    if (vendor) {
      purchaseRequest.vendor = vendor;
    }

    // Update items if provided
    if (items && Array.isArray(items)) {
      // Validate all products exist
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          const error = new Error(`Product with id ${item.product_id} not found`);
          error.status = 404;
          throw error;
        }
        if (!item.quantity || item.quantity <= 0) {
          const error = new Error('Quantity must be greater than 0');
          error.status = 400;
          throw error;
        }
      }

      // Delete old items
      await PurchaseRequestItem.destroy({
        where: { purchase_request_id: id },
        transaction
      });

      // Create new items
      const itemsData = items.map(item => ({
        purchase_request_id: id,
        product_id: item.product_id,
        quantity: item.quantity
      }));

      await PurchaseRequestItem.bulkCreate(itemsData, { transaction });
    }

    // If status changes to PENDING, call external API
    if (newStatus === 'PENDING' && oldStatus === 'DRAFT') {
      purchaseRequest.status = 'PENDING';
      await purchaseRequest.save({ transaction });

      // Fetch updated data with items AND product details for API call
      const updatedPR = await PurchaseRequest.findByPk(id, {
        include: [
          {
            model: PurchaseRequestItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku']
              }
            ]
          }
        ],
        transaction
      });

      // Call hub.foomid.id API
      await callHubApi(updatedPR);
    } else if (status && status !== oldStatus) {
      purchaseRequest.status = status;
      await purchaseRequest.save({ transaction });
    }

    await transaction.commit();

    // Fetch complete updated purchase request
    const result = await PurchaseRequest.findByPk(id, {
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name']
        },
        {
          model: PurchaseRequestItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku']
            }
          ]
        }
      ]
    });

    return result;
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

export const deletePurchaseRequest = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const purchaseRequest = await PurchaseRequest.findByPk(id, { transaction });

    if (!purchaseRequest) {
      const error = new Error('Purchase request not found');
      error.status = 404;
      throw error;
    }

    // Validate: deletion only allowed when status is DRAFT
    if (purchaseRequest.status !== 'DRAFT') {
      const error = new Error('Cannot delete purchase request. Only DRAFT status can be deleted.');
      error.status = 400;
      throw error;
    }

    // Delete items (cascade)
    await PurchaseRequestItem.destroy({
      where: { purchase_request_id: id },
      transaction
    });

    // Delete purchase request
    await purchaseRequest.destroy({ transaction });

    await transaction.commit();

    return { message: 'Purchase request deleted successfully' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
