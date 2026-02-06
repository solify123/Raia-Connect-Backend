import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { CheckoutController } from '../controllers/CheckoutController';

/** Only the two required endpoints for the project. */
export function createRoutes(
  productController: ProductController,
  checkoutController: CheckoutController
): Router {
  const router = Router();

  router.get('/products', productController.getProducts);
  router.post('/checkout', checkoutController.checkout);

  return router;
}
