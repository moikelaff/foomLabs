# Inventory Allocation System

Full-stack inventory management system for managing stock across warehouses, purchase requests, and webhook integration with external suppliers.

## Tech Stack

**Backend:**
- Node.js (ES Modules) + Express.js
- PostgreSQL + Sequelize ORM
- MVC Architecture (Routes → Controllers → Services → Models)

**Frontend:**
- Next.js 16 (App Router) + TypeScript
- React 19 + Tailwind CSS v4
- Headless UI for accessible components

## Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm or yarn

## How to Run Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd foomLabs
```

### 2. Backend Setup

```bash
cd backend

# The project uses a unified .env.example in the root folder
# Copy it and configure your database credentials
cp ../.env.example .env
# Edit .env with your Supabase PostgreSQL credentials:
# DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

npm install

# Setup database (creates tables and seeds data)
npm run db:migrate
npm run db:seed

# Start backend server
npm run dev
```

Backend runs on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Copy the unified .env.example from root
cp ../.env.example .env.local
# The NEXT_PUBLIC_API_URL is already configured

npm install

# Start frontend server
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Test Webhook Integration

The external supplier webhook endpoint is available at:
```
POST http://localhost:3001/webhook/receive-stock
```

Use the external hub URL `hub.foomid.id` to simulate stock delivery webhooks.

## Project Structure

```
foomLabs/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── migrations/      # Database migrations
│   │   ├── seeders/         # Sample data
│   │   └── utils/           # Helpers (hubApi, reference generator)
│   └── package.json
└── frontend/
    ├── app/                 # Next.js pages (App Router)
    ├── components/          # Reusable UI components
    ├── lib/                 # API client, types
    └── package.json
```

## Core Design Decisions

### 1. Purchase Request Reference Generation
- Format: `PR-YYYYMMDD-XXXX` (e.g., `PR-20251125-0001`)
- Generated server-side to ensure uniqueness
- Daily counter resets automatically
- Used as idempotency key for webhook processing

### 2. Webhook Idempotency
- Uses purchase request `reference` as unique identifier
- Prevents duplicate stock updates from repeated webhook calls
- Returns 200 OK with message if reference already processed
- Validates reference format before processing

### 3. Status Workflow
- **DRAFT**: Editable/deletable, local only
- **PENDING**: Submitted to external system via webhook, read-only
- **COMPLETED**: Stock received, automatically updated via incoming webhook

When status changes from DRAFT → PENDING:
1. Backend sends webhook to external hub (`hub.foomid.id`)
2. External system processes order
3. External system sends delivery webhook back
4. Backend updates stock and marks request as COMPLETED

### 4. Stock Management
- Stock tracked per warehouse + product combination
- Quantities updated automatically when webhook receives stock
- No manual stock adjustments (audit trail via purchase requests)

### 5. API Architecture
- Service layer handles all business logic (validation, reference generation, hub API calls)
- Controllers handle HTTP concerns only
- Models define database structure and relationships
- Clear separation enables easier testing and maintenance

### 6. Frontend State Management
- Server-side data fetching with client-side interactions
- Real-time updates via re-fetching after mutations
- Optimistic UI disabled to prevent sync issues
- Error boundaries for graceful error handling

## API Endpoints

### Products
- `GET /products` - List all products

### Stocks
- `GET /stocks` - List stock levels across warehouses

### Purchase Requests
- `GET /purchase/request` - List all requests
- `GET /purchase/request/:id` - Get single request
- `POST /purchase/request` - Create new request (status: DRAFT)
- `PUT /purchase/request/:id` - Update request (DRAFT only)
- `DELETE /purchase/request/:id` - Delete request (DRAFT only)

### Webhook
- `POST /webhook/receive-stock` - Receive stock delivery from supplier

## Database Schema

**Tables:**
- `warehouses` - Warehouse locations (id, name, location)
- `products` - Product catalog (id, name, sku, description)
- `stocks` - Stock levels (id, warehouse_id, product_id, quantity)
- `purchase_requests` - Purchase planning (id, reference, warehouse_id, vendor, status, timestamps)
- `purchase_request_items` - Line items (id, purchase_request_id, product_id, quantity)

**Relationships:**
- Stock belongs to Warehouse and Product
- PurchaseRequest belongs to Warehouse, has many PurchaseRequestItems
- PurchaseRequestItem belongs to PurchaseRequest and Product

## Possible Improvements

### Backend
- **Authentication & Authorization**: JWT-based auth for user roles (admin, warehouse manager)
- **Testing**: Unit tests for services, integration tests for endpoints
- **Pagination**: Add pagination to list endpoints for better performance
- **Filtering & Sorting**: Query parameters for advanced data filtering
- **Logging**: Structured logging with Winston/Pino for debugging and monitoring
- **Rate Limiting**: Prevent API abuse with request throttling
- **Swagger Documentation**: Auto-generated API docs with OpenAPI spec
- **Audit Trail**: Track all changes to purchase requests and stock levels
- **Email Notifications**: Alert stakeholders on status changes
- **Validation Improvements**: More robust input validation with Joi/Yup

### Frontend
- **Authentication UI**: Login/logout flows with protected routes
- **Advanced Filtering**: Filter purchase requests by status, date, warehouse
- **Sorting**: Sortable table columns
- **Search**: Full-text search across products and requests
- **Real-time Updates**: WebSocket integration for live stock updates
- **Export**: Download reports as CSV/PDF
- **Mobile Responsive**: Optimize layout for mobile devices
- **Dark Mode**: Theme toggle for better UX
- **Form Validation**: Client-side validation with react-hook-form + zod
- **Caching**: SWR or React Query for better data caching
- **Performance**: Code splitting, lazy loading, image optimization

### DevOps
- **Docker**: Containerize both backend and frontend
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Environment Management**: Separate configs for dev/staging/prod
- **Database Backups**: Automated backup strategy
- **Monitoring**: APM tools (New Relic, Datadog) for performance tracking

## License

ISC

