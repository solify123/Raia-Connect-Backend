import { Request, Response } from 'express';
import { ProductService } from '../../application/services/ProductService';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  getProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error('GET /products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('GET /products/:id error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
