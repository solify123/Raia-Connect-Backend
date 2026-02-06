import { Product } from '../../domain/Product';
import { IProductRepository } from '../../infrastructure/repositories/ProductRepository';

export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async getProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}
