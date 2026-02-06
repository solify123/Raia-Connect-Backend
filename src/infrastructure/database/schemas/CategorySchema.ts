import mongoose, { Schema, Document, Model } from 'mongoose';
import { Category } from '../../../domain/Category';

export interface ICategoryDocument extends Omit<Category, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const CategoryModel: Model<ICategoryDocument> =
  mongoose.models.Category ?? mongoose.model<ICategoryDocument>('Category', CategorySchema);
