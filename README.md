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

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your_password

PORT=3001
NODE_ENV=development
```

### 4. Create database

```bash
# Using psql
psql -U postgres
CREATE DATABASE inventory_db;
\q
```

### 5. Run database migrations

```bash
npm run db:migrate
```

### 6. Seed sample data (optional)

```bash
npm run db:seed
```

### 7. Start the server

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
- `GET /products` - List all products *(Coming soon)*

### Stocks
- `GET /stocks` - List stock levels with warehouse and product info *(Coming soon)*

### Purchase Requests
- `GET /purchase/request` - List all purchase requests *(Coming soon)*
- `GET /purchase/request/:id` - Get single purchase request *(Coming soon)*
- `POST /purchase/request` - Create new purchase request *(Coming soon)*
- `PUT /purchase/request/:id` - Update purchase request *(Coming soon)*
- `DELETE /purchase/request/:id` - Delete purchase request *(Coming soon)*

### Webhook
- `POST /webhook/receive-stock` - Receive stock from supplier *(Coming soon)*

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

*(To be documented as development progresses)*

## Future Improvements

- Authentication & Authorization (JWT)
- Request validation middleware
- API rate limiting
- Comprehensive error handling
- Unit and integration tests
- API documentation (Swagger)
- Logging system (Winston)
- Database connection pooling optimization

## License

ISC
