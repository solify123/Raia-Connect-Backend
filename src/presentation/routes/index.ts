import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { CheckoutController } from '../controllers/CheckoutController';

export function createRoutes(
  productController: ProductController,
  checkoutController: CheckoutController
): Router {
  const router = Router();

  router.get('/products', productController.getProducts);
  router.post('/checkout', checkoutController.checkout);

  return router;
}
