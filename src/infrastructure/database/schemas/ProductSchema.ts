import mongoose, { Schema, Document, Model, Types } from 'mongoose';
// Ensure Category model is registered before Product (for ref: 'Category')
import './CategorySchema';

/**
 * Product document in DB: has categoryId (ref to Category), not category name.
 * API still returns Product with category (name string) via populate.
 */
export interface IProductDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  categoryId: Types.ObjectId;
  stock: number;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocumentPopulated extends Omit<IProductDocument, 'categoryId'> {
  categoryId: { _id: mongoose.Types.ObjectId; name: string };
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product ?? mongoose.model<IProductDocument>('Product', ProductSchema);
