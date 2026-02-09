import { Product } from '../../domain/Product';
import { IProductRepository } from '../../infrastructure/repositories/ProductRepository';

export interface CheckoutRequest {
  productId: string;
  quantity?: number;
}

export interface CheckoutResult {
  success: boolean;
  product?: Product;
  message?: string;
}

export class CheckoutService {
  constructor(private readonly productRepository: IProductRepository) {}

  async checkout(request: CheckoutRequest): Promise<CheckoutResult> {
    const quantity = Math.max(1, request.quantity ?? 1);

    const product = await this.productRepository.findById(request.productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return {
        success: false,
        message: `Insufficient stock. Available: ${product.stock}, requested: ${quantity}`,
      };
    }

    const updated = await this.productRepository.decrementStock(request.productId, quantity);
    if (!updated) {
      return {
        success: false,
        message: 'Stock was modified by another request. Please retry.',
      };
    }

    return { success: true, product: updated };
  }
}
