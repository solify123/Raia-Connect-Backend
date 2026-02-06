import { Request, Response } from 'express';
import { CheckoutService } from '../../application/services/CheckoutService';

export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  checkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, quantity } = req.body;

      if (!productId || typeof productId !== 'string') {
        res.status(400).json({ error: 'productId is required and must be a string' });
        return;
      }

      const result = await this.checkoutService.checkout({
        productId: productId.trim(),
        quantity: typeof quantity === 'number' && quantity > 0 ? quantity : undefined,
      });

      if (!result.success) {
        if (result.message?.includes('not found')) {
          res.status(404).json({ error: result.message });
          return;
        }
        if (result.message?.includes('Insufficient stock') || result.message?.includes('Stock was modified')) {
          res.status(400).json({ error: result.message });
          return;
        }
        res.status(400).json({ error: result.message ?? 'Checkout failed' });
        return;
      }

      res.status(201).json({
        message: 'Order placed successfully',
        product: result.product,
      });
    } catch (error) {
      console.error('POST /checkout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
