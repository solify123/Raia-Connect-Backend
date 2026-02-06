import { Category } from '../../domain/Category';
import { ICategoryRepository } from '../../infrastructure/repositories/CategoryRepository';

export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
