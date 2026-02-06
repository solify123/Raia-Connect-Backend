import { CheckoutService } from '../CheckoutService';
import { IProductRepository } from '../../../infrastructure/repositories/ProductRepository';
import { Product } from '../../../domain/Product';

describe('CheckoutService', () => {
  const mockProduct: Product = {
    _id: 'product-1',
    name: 'Aspirin',
    price: 12.99,
    category: 'Pain Relief',
    stock: 10,
  };

  let mockRepository: jest.Mocked<IProductRepository>;
  let checkoutService: CheckoutService;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      decrementStock: jest.fn(),
      findAll: jest.fn(),
    };
    checkoutService = new CheckoutService(mockRepository);
  });

  it('should return failure when product is not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const result = await checkoutService.checkout({ productId: 'non-existent' });

    expect(result.success).toBe(false);
    expect(result.message).toContain('not found');
    expect(mockRepository.decrementStock).not.toHaveBeenCalled();
  });

  it('should return failure when stock is insufficient', async () => {
    mockRepository.findById.mockResolvedValue({ ...mockProduct, stock: 0 });

    const result = await checkoutService.checkout({ productId: 'product-1', quantity: 1 });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient stock');
    expect(result.message).toContain('Available: 0');
    expect(mockRepository.decrementStock).not.toHaveBeenCalled();
  });

  it('should return failure when requested quantity exceeds stock', async () => {
    mockRepository.findById.mockResolvedValue({ ...mockProduct, stock: 2 });

    const result = await checkoutService.checkout({ productId: 'product-1', quantity: 5 });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient stock');
    expect(mockRepository.decrementStock).not.toHaveBeenCalled();
  });

  it('should succeed and decrement stock when product exists and stock is available', async () => {
    mockRepository.findById.mockResolvedValue(mockProduct);
    const updatedProduct = { ...mockProduct, stock: 9 };
    mockRepository.decrementStock.mockResolvedValue(updatedProduct);

    const result = await checkoutService.checkout({ productId: 'product-1', quantity: 1 });

    expect(result.success).toBe(true);
    expect(result.product).toEqual(updatedProduct);
    expect(mockRepository.decrementStock).toHaveBeenCalledWith('product-1', 1);
  });

  it('should use quantity 1 when quantity is not provided', async () => {
    mockRepository.findById.mockResolvedValue(mockProduct);
    mockRepository.decrementStock.mockResolvedValue({ ...mockProduct, stock: 9 });

    await checkoutService.checkout({ productId: 'product-1' });

    expect(mockRepository.decrementStock).toHaveBeenCalledWith('product-1', 1);
  });

  it('should return failure when decrementStock returns null (concurrent update)', async () => {
    mockRepository.findById.mockResolvedValue(mockProduct);
    mockRepository.decrementStock.mockResolvedValue(null);

    const result = await checkoutService.checkout({ productId: 'product-1' });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Stock was modified');
  });
});
