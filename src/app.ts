import express, { Application, Request, Response } from 'express';
import listingRoutes from './app/modules/listings/listings.route';
import cors from 'cors';
import OrderRoutes from './app/modules/order/orders.route';
import authRoutes from './app/modules/auth/auth.routes';

// Create app using express
const app: Application = express();

// Parse incoming JSON requests
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing) for all origins
app.use(cors({
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE', // Allow these methods
  allowedHeaders: 'Content-Type,Authorization', // Allow these headers
}));

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Revive Mart API!',
    endpoints: {
      products: '/api/listings',
      orders: '/api/orders',
    },
  });
});

// product routes with the path '/api/listings'
app.use('/api/listings', listingRoutes);
//Auth routes
app.use('/api/auth', authRoutes);

// order routes with the path '/api/orders'
app.use('/api/orders', OrderRoutes);

export default app;
