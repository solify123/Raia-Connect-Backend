import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDatabase } from './infrastructure/database/mongo';
import { ProductRepository } from './infrastructure/repositories/ProductRepository';
import { ProductService } from './application/services/ProductService';
import { CheckoutService } from './application/services/CheckoutService';
import { ProductController } from './presentation/controllers/ProductController';
import { CheckoutController } from './presentation/controllers/CheckoutController';
import { createRoutes } from './presentation/routes';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  await connectDatabase();

  const productRepository = new ProductRepository();
  const productService = new ProductService(productRepository);
  const checkoutService = new CheckoutService(productRepository);
  const productController = new ProductController(productService);
  const checkoutController = new CheckoutController(checkoutService);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/', createRoutes(productController, checkoutController));

  app.listen(PORT, () => {
    console.log(`Raia-Connect API running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
