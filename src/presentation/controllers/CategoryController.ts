import { Request, Response } from 'express';
import { CategoryService } from '../../application/services/CategoryService';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error('GET /categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
