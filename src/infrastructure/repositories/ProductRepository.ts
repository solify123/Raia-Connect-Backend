import { Product } from '../../domain/Product';
import { ProductModel, IProductDocument, IProductDocumentPopulated } from '../database/schemas/ProductSchema';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  decrementStock(id: string, quantity?: number): Promise<Product | null>;
}

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const docs = await ProductModel.find()
      .populate('categoryId', 'name')
      .lean()
      .exec();
    return (docs as IProductDocumentPopulated[]).map(this.toProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id)
      .populate('categoryId', 'name')
      .lean()
      .exec();
    return doc ? this.toProduct(doc as IProductDocumentPopulated) : null;
  }

  /**
   * Decrements stock only if current stock >= quantity. Uses findOneAndUpdate
   * for atomic update (ACID-like behavior). Returns product with category name via populate.
   */
  async decrementStock(id: string, quantity: number = 1): Promise<Product | null> {
    const updated = await ProductModel.findOneAndUpdate(
      { _id: id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    )
      .exec();
    if (!updated) return null;
    return this.findById(updated._id.toString());
  }

  private toProduct(doc: IProductDocumentPopulated): Product {
    const categoryName =
      doc.categoryId && typeof doc.categoryId === 'object' && 'name' in doc.categoryId
        ? (doc.categoryId as { name: string }).name
        : '';
    return {
      _id: doc._id.toString(),
      name: doc.name,
      price: doc.price,
      category: categoryName,
      stock: doc.stock,
      imageUrl: doc.imageUrl,
    };
  }
}
