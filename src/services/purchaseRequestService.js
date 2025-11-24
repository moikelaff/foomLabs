import { sequelize, PurchaseRequest, PurchaseRequestItem, Warehouse, Product } from '../models/index.js';
import { generateReference } from '../utils/referenceGenerator.js';

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
