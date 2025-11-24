# Final Integration Test

This document provides a complete end-to-end test of the Inventory Allocation System API.

## Prerequisites
- Server running on `http://localhost:3001`
- Database seeded with initial data (3 warehouses, 5 products)

## Test Sequence

### 1. Health Check
```bash
curl http://localhost:3001/health
```
**Expected:** `"success": true`

---

### 2. List Products
```bash
curl http://localhost:3001/products
```
**Expected:** 5 products (ICYMINT, CHOCOFUDGE, VANILLADREAM, STRAWBLAST, CARAMELSWIRL)

---

### 3. Check Initial Stock
```bash
curl http://localhost:3001/stocks
```
**Expected:** Stock levels from previous operations

---

### 4. Create Purchase Request (DRAFT)
```bash
curl -X POST http://localhost:3001/purchase/request \
  -H "Content-Type: application/json" \
  -d '{"warehouse_id":3,"vendor":"Ice Cream Supplier","items":[{"product_id":4,"quantity":200},{"product_id":5,"quantity":150}]}'
```
**Expected:** 
- New purchase request created
- Status: `DRAFT`
- Reference: `PR0000X` (auto-generated)

---

### 5. Validation Test: Empty Vendor
```bash
curl -X POST http://localhost:3001/purchase/request \
  -H "Content-Type: application/json" \
  -d '{"warehouse_id":1,"vendor":"","items":[{"product_id":1,"quantity":50}]}'
```
**Expected:** `"Validation error: vendor is required and cannot be empty"`

---

### 6. Update Purchase Request
```bash
# Replace {id} with actual ID from step 4
curl -X PUT http://localhost:3001/purchase/request/{id} \
  -H "Content-Type: application/json" \
  -d '{"vendor":"Premium Ice Cream Supplier"}'
```
**Expected:** Vendor updated successfully

---

### 7. Attempt to Change Status to PENDING
```bash
# This will fail calling external API (405 expected), transaction will rollback
curl -X PUT http://localhost:3001/purchase/request/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"PENDING"}'
```
**Expected:** Error about external API (transaction rollback)

---

### 8. Manually Set to PENDING (for webhook test)
Run in Node.js:
```javascript
node -e "import('./src/models/index.js').then(async ({PurchaseRequest}) => { await PurchaseRequest.update({status: 'PENDING'}, {where: {id: YOUR_ID}}); console.log('Updated'); process.exit(0); })"
```

---

### 9. Webhook: Receive Stock
```bash
curl -X POST http://localhost:3001/webhook/receive-stock \
  -H "Content-Type: application/json" \
  -d '{"reference":"PR0000X","items":[{"product_id":4,"quantity":200},{"product_id":5,"quantity":150}]}'
```
**Expected:**
- `"message": "Stock received successfully"`
- `"status": "COMPLETED"`
- `"alreadyProcessed": false`

---

### 10. Verify Stock Updated
```bash
curl http://localhost:3001/stocks
```
**Expected:** New stock entries for products 4 and 5 at warehouse 3

---

### 11. Test Idempotency: Call Webhook Again
```bash
curl -X POST http://localhost:3001/webhook/receive-stock \
  -H "Content-Type: application/json" \
  -d '{"reference":"PR0000X","items":[{"product_id":4,"quantity":200},{"product_id":5,"quantity":150}]}'
```
**Expected:**
- `"message": "Stock already received for this purchase request"`
- `"alreadyProcessed": true`
- Stock quantity remains the same (not doubled)

---

### 12. Verify Stock Not Duplicated
```bash
curl http://localhost:3001/stocks
```
**Expected:** Stock quantities unchanged from step 10

---

### 13. Attempt to Update COMPLETED Request
```bash
curl -X PUT http://localhost:3001/purchase/request/{id} \
  -H "Content-Type: application/json" \
  -d '{"vendor":"Should Fail"}'
```
**Expected:** `"Cannot update purchase request. Only DRAFT status can be modified."`

---

### 14. Attempt to Delete COMPLETED Request
```bash
curl -X DELETE http://localhost:3001/purchase/request/{id}
```
**Expected:** `"Cannot delete purchase request. Only DRAFT status can be deleted."`

---

### 15. Create and Delete DRAFT Request
```bash
# Create
curl -X POST http://localhost:3001/purchase/request \
  -H "Content-Type: application/json" \
  -d '{"warehouse_id":1,"vendor":"Test Delete","items":[{"product_id":1,"quantity":10}]}'

# Delete (use returned ID)
curl -X DELETE http://localhost:3001/purchase/request/{new_id}
```
**Expected:** 
- Create: Success
- Delete: `"Purchase request deleted successfully"`

---

## Test Results Summary

All tests should pass, demonstrating:

✅ **CRUD Operations**
- Create, Read, Update, Delete purchase requests
- Status-based business rules (DRAFT → PENDING → COMPLETED)

✅ **Validation**
- Input validation on all endpoints
- Clear error messages with field identifiers

✅ **Business Logic**
- Reference auto-generation
- External API integration attempt
- Webhook idempotency
- Stock accumulation

✅ **Data Integrity**
- Transaction-based operations
- Proper rollback on failures
- Cascade delete for related items

✅ **Error Handling**
- Appropriate HTTP status codes
- Detailed error messages
- Development mode stack traces
