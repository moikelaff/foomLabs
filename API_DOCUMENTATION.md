# API Documentation

## Base URL
```
http://localhost:3001
```

## Response Format
All endpoints return JSON with the following structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Stack trace (only in development)"
  }
}
```

---

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Inventory Allocation System API is running",
  "timestamp": "2025-11-24T12:00:00.000Z"
}
```

---

### Products

#### GET /products
Get all products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Icy Mint",
      "sku": "ICYMINT",
      "createdAt": "2025-11-24T10:00:00.000Z",
      "updatedAt": "2025-11-24T10:00:00.000Z"
    }
  ]
}
```

---

### Stocks

#### GET /stocks
Get all stock levels with warehouse and product information.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "warehouse_id": 1,
      "product_id": 1,
      "quantity": 100,
      "warehouse": {
        "id": 1,
        "name": "Jakarta Warehouse"
      },
      "product": {
        "id": 1,
        "name": "Icy Mint",
        "sku": "ICYMINT"
      }
    }
  ]
}
```

---

### Purchase Requests

#### GET /purchase/request
Get all purchase requests.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "reference": "PR00001",
      "warehouse_id": 1,
      "vendor": "Vendor Name",
      "status": "DRAFT",
      "warehouse": {
        "id": 1,
        "name": "Jakarta Warehouse"
      },
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "quantity": 50,
          "product": {
            "id": 1,
            "name": "Icy Mint",
            "sku": "ICYMINT"
          }
        }
      ]
    }
  ]
}
```

---

#### GET /purchase/request/:id
Get a specific purchase request by ID.

**Parameters:**
- `id` (number) - Purchase request ID

**Response:**
Same as GET /purchase/request but returns a single object in `data`.

**Error Responses:**
- `404` - Purchase request not found

---

#### POST /purchase/request
Create a new purchase request.

**Request Body:**
```json
{
  "warehouse_id": 1,
  "vendor": "Vendor Name",
  "items": [
    {
      "product_id": 1,
      "quantity": 50
    },
    {
      "product_id": 2,
      "quantity": 30
    }
  ]
}
```

**Validation:**
- `warehouse_id` (required) - Must exist in database
- `vendor` (required) - Cannot be empty
- `items` (required) - Must be non-empty array
- `items[].product_id` (required) - Must exist in database
- `items[].quantity` (required) - Must be > 0

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "reference": "PR00001",
    "warehouse_id": 1,
    "vendor": "Vendor Name",
    "status": "DRAFT",
    "warehouse": { ... },
    "items": [ ... ]
  }
}
```

**Status:** `201 Created`

**Error Responses:**
- `400` - Validation error
- `404` - Warehouse or product not found

---

#### PUT /purchase/request/:id
Update a purchase request. Only allowed when status is DRAFT.

**Parameters:**
- `id` (number) - Purchase request ID

**Request Body (all fields optional):**
```json
{
  "warehouse_id": 2,
  "vendor": "Updated Vendor",
  "status": "PENDING",
  "items": [
    {
      "product_id": 3,
      "quantity": 100
    }
  ]
}
```

**Validation:**
- Can only update when current status is DRAFT
- `vendor` - If provided, cannot be empty
- `status` - Must be one of: DRAFT, PENDING, COMPLETED
- `items` - If provided, must be non-empty array with valid product_id and quantity > 0
- `warehouse_id` - If provided, must exist in database

**Special Behavior:**
- When status changes from DRAFT to PENDING, triggers external API call to `hub.foomid.id`
- If API call fails, transaction is rolled back

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "reference": "PR00001",
    "status": "PENDING",
    ...
  }
}
```

**Error Responses:**
- `400` - Validation error or cannot update non-DRAFT status
- `404` - Purchase request, warehouse, or product not found
- `500` - External API call failed

---

#### DELETE /purchase/request/:id
Delete a purchase request. Only allowed when status is DRAFT.

**Parameters:**
- `id` (number) - Purchase request ID

**Response:**
```json
{
  "success": true,
  "message": "Purchase request deleted successfully"
}
```

**Error Responses:**
- `400` - Cannot delete non-DRAFT status
- `404` - Purchase request not found

---

### Webhook

#### POST /webhook/receive-stock
Receive stock from supplier and update inventory.

**Request Body:**
```json
{
  "reference": "PR00001",
  "items": [
    {
      "product_id": 1,
      "quantity": 50
    },
    {
      "product_id": 2,
      "quantity": 30
    }
  ]
}
```

**Validation:**
- `reference` (required) - Cannot be empty
- `items` (required) - Must be non-empty array
- `items[].product_id` (required)
- `items[].quantity` (required) - Must be > 0

**Idempotency:**
- If purchase request status is already COMPLETED, returns success without processing
- Set `alreadyProcessed: true` in response

**Business Logic:**
1. Find purchase request by reference
2. Check if already COMPLETED (idempotency)
3. Validate status is PENDING
4. For each item, create or update stock (adds to existing quantity)
5. Update purchase request status to COMPLETED

**Response:**
```json
{
  "success": true,
  "message": "Stock received successfully",
  "data": {
    "reference": "PR00001",
    "status": "COMPLETED",
    "alreadyProcessed": false
  }
}
```

**Error Responses:**
- `400` - Validation error or status not PENDING
- `404` - Purchase request not found

---

## Status Flow

Purchase requests follow this status flow:

```
DRAFT → PENDING → COMPLETED
```

- **DRAFT**: Initial state, can be updated/deleted
- **PENDING**: Awaiting stock delivery, triggered external API call
- **COMPLETED**: Stock received and allocated

---

## Error Codes

- `400` - Bad Request (validation error, business rule violation)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (unexpected error, external API failure)

---

## Development Notes

### Environment Variables
```bash
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
HUB_API_URL=https://hub.foomid.id
HUB_API_KEY=your-api-key
HUB_API_SECRET=your-api-secret
```

### Database Migrations
```bash
npm run db:migrate     # Run migrations
npm run db:seed        # Seed sample data
npm run db:reset       # Reset database
```

### Reference Generation
Purchase request references are automatically generated in format: `PR00001`, `PR00002`, etc.
