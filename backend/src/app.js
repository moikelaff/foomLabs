import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './models/index.js';
import productRoutes from './routes/products.js';
import stockRoutes from './routes/stocks.js';
import purchaseRequestRoutes from './routes/purchaseRequests.js';
import webhookRoutes from './routes/webhook.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3011',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Inventory Allocation System API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/products', productRoutes);
app.use('/stocks', stockRoutes);
app.use('/purchase/request', purchaseRequestRoutes);
app.use('/webhook', webhookRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.originalUrl
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';
  
  // Log detailed error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', err.stack);
  }
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
