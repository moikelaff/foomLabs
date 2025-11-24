export const validateCreatePurchaseRequest = (req, res, next) => {
  const { warehouse_id, vendor, items } = req.body;

  if (!warehouse_id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error: warehouse_id is required',
        field: 'warehouse_id'
      }
    });
  }

  if (!vendor || vendor.trim() === '') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error: vendor is required and cannot be empty',
        field: 'vendor'
      }
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error: items must be a non-empty array',
        field: 'items'
      }
    });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (!item.product_id) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Validation error: items[${i}].product_id is required`,
          field: `items[${i}].product_id`
        }
      });
    }

    if (!item.quantity || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Validation error: items[${i}].quantity must be greater than 0`,
          field: `items[${i}].quantity`
        }
      });
    }
  }

  next();
};

export const validateUpdatePurchaseRequest = (req, res, next) => {
  const { warehouse_id, vendor, status, items } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error: request body cannot be empty'
      }
    });
  }

  if (vendor !== undefined && vendor.trim() === '') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error: vendor cannot be empty',
        field: 'vendor'
      }
    });
  }

  if (status !== undefined) {
    const validStatuses = ['DRAFT', 'PENDING', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Validation error: status must be one of: ${validStatuses.join(', ')}`,
          field: 'status'
        }
      });
    }
  }

  if (items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error: items must be a non-empty array',
          field: 'items'
        }
      });
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.product_id) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Validation error: items[${i}].product_id is required`,
            field: `items[${i}].product_id`
          }
        });
      }

      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Validation error: items[${i}].quantity must be greater than 0`,
            field: `items[${i}].quantity`
          }
        });
      }
    }
  }

  next();
};

export const validateWebhookReceiveStock = (req, res, next) => {
  const { reference, items } = req.body;

  if (!reference || reference.trim() === '') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error: reference is required and cannot be empty',
        field: 'reference'
      }
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error: items must be a non-empty array',
        field: 'items'
      }
    });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (!item.product_id) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Validation error: items[${i}].product_id is required`,
          field: `items[${i}].product_id`
        }
      });
    }

    if (!item.quantity || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Validation error: items[${i}].quantity must be greater than 0`,
          field: `items[${i}].quantity`
        }
      });
    }
  }

  next();
};
