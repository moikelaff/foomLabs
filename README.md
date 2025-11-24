# Inventory Allocation System - Backend API

Backend API for managing inventory allocation across warehouses with purchase request planning and webhook integration.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Architecture**: MVC Pattern (Routes → Controllers → Services → Models)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Products
- `GET /products` - List all products

### Stocks
- `GET /stocks` - List stock levels with warehouse and product info

### Purchase Requests
- `GET /purchase/request` - List all purchase requests
- `GET /purchase/request/:id` - Get single purchase request
- `POST /purchase/request` - Create new purchase request
- `PUT /purchase/request/:id` - Update purchase request (DRAFT only)
- `DELETE /purchase/request/:id` - Delete purchase request (DRAFT only)

### Webhook
- `POST /webhook/receive-stock` - Receive stock from supplier

See `API_DOCUMENTATION.md` for detailed endpoint documentation.

## Database Schema

### Tables
- **warehouses**: Warehouse locations
- **products**: Product catalog with SKU
- **stocks**: Stock levels per warehouse/product
- **purchase_requests**: Purchase planning records
- **purchase_request_items**: Line items for purchase requests

See `PROJECT_DOCUMENTATION.md` in the root folder for detailed schema.

## Development Scripts

```bash
# Start server with auto-reload
npm run dev

# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Seed database
npm run db:seed

# Undo all seeds
npm run db:seed:undo

# Reset database (undo all, migrate, seed)
npm run db:reset
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── models/          # Sequelize models
│   ├── migrations/      # Database migrations
│   ├── seeders/         # Sample data
│   ├── services/        # Business logic
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middleware
│   ├── utils/           # Helper functions
│   └── app.js           # Express application
├── .env.example         # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Design Decisions

### Architecture
- **MVC Pattern**: Separation of concerns with Routes → Controllers → Services → Models
- **Transaction-based operations**: All write operations use database transactions for data consistency
- **Idempotency**: Webhook endpoint checks for duplicate processing to prevent double stock allocation

### Status Flow
Purchase requests follow a strict status flow:
- **DRAFT**: Initial state, allows updates and deletion
- **PENDING**: Triggered external API notification, awaiting stock delivery
- **COMPLETED**: Stock received and allocated to warehouse

### Reference Generation
Auto-generated purchase request references (PR00001, PR00002...) ensure unique identification and tracking.

### Error Handling
- Input validation middleware on all endpoints
- Consistent error response format with status codes
- Detailed stack traces in development mode
- Transaction rollback on failures

### External Integration
- Hub API integration on status change (DRAFT → PENDING)
- Graceful handling of external API failures with transaction rollback

## Future Improvements

- Authentication & Authorization (JWT)
- API rate limiting
- Unit and integration tests
- API documentation with Swagger/OpenAPI
- Logging system (Winston/Pino)
- Database connection pooling optimization
- Pagination for list endpoints
- Filtering and sorting capabilities
- Audit trail for status changes

## License

ISC
