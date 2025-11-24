# Test Endpoints for Commit 5

## Testing PUT /purchase/request/:id

### 1. Create a new purchase request
```bash
curl -X POST http://localhost:3001/purchase/request -H "Content-Type: application/json" -d '{"warehouse_id":2,"vendor":"Test Vendor","items":[{"product_id":3,"quantity":100}]}'
```

### 2. Update vendor while keeping DRAFT status
```bash
curl -X PUT http://localhost:3001/purchase/request/2 -H "Content-Type: application/json" -d '{"vendor":"Updated Test Vendor"}'
```

### 3. Update items
```bash
curl -X PUT http://localhost:3001/purchase/request/2 -H "Content-Type: application/json" -d '{"items":[{"product_id":4,"quantity":50},{"product_id":5,"quantity":25}]}'
```

### 4. Try to change status to PENDING (will call external API and likely fail)
```bash
curl -X PUT http://localhost:3001/purchase/request/2 -H "Content-Type: application/json" -d '{"status":"PENDING"}'
```

### 5. Try to update when status is not DRAFT (should fail)
First manually update status to COMPLETED, then try to update:
```bash
curl -X PUT http://localhost:3001/purchase/request/2 -H "Content-Type: application/json" -d '{"vendor":"Should Fail"}'
```

## Testing DELETE /purchase/request/:id

### 1. Delete a DRAFT purchase request (should succeed)
```bash
curl -X DELETE http://localhost:3001/purchase/request/2
```

### 2. Try to delete non-DRAFT purchase request (should fail)
First create and manually set status to PENDING/COMPLETED, then:
```bash
curl -X DELETE http://localhost:3001/purchase/request/3
```

## Summary of Implemented Features

### PUT /purchase/request/:id
- ✅ Updates only allowed when status is DRAFT
- ✅ Can update warehouse_id (validates warehouse exists)
- ✅ Can update vendor
- ✅ Can update items (validates products exist, recreates items)
- ✅ When status changes from DRAFT to PENDING, calls hub.foomid.id API
- ✅ Transaction-based with rollback on API failure
- ✅ Returns complete nested data with warehouse and items

### DELETE /purchase/request/:id
- ✅ Deletion only allowed when status is DRAFT
- ✅ Cascades to delete items
- ✅ Transaction-based
- ✅ Returns success message
