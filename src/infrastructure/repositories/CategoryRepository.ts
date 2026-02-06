import { Category } from '../../domain/Category';
import { CategoryModel, ICategoryDocument } from '../database/schemas/CategorySchema';

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
}

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    const docs = await CategoryModel.find().lean().exec();
    return docs.map(this.toCategory);
  }

  async findById(id: string): Promise<Category | null> {
    const doc = await CategoryModel.findById(id).lean().exec();
    return doc ? this.toCategory(doc as ICategoryDocument) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const doc = await CategoryModel.findOne({ name }).lean().exec();
    return doc ? this.toCategory(doc as ICategoryDocument) : null;
  }

  private toCategory(doc: ICategoryDocument): Category {
    return {
      _id: doc._id.toString(),
      name: doc.name,
    };
  }
}
