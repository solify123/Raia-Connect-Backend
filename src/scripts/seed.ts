/**
 * Seed script: populates MongoDB with Categories and Products.
 * Run: npm run seed
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { CategoryModel } from '../infrastructure/database/schemas/CategorySchema';
import { ProductModel } from '../infrastructure/database/schemas/ProductSchema';

dotenv.config();

const INITIAL_CATEGORIES = [
  { name: 'Pain Relief' },
  { name: 'Vitamins' },
  { name: 'Skincare' },
  { name: 'Hygiene' },
];

const INITIAL_PRODUCTS = [
  { name: 'Aspirin', price: 12.99, categoryName: 'Pain Relief', stock: 50, imageUrl: '/assets/Aspirin.jpg' },
  { name: 'Vitamin C', price: 24.99, categoryName: 'Vitamins', stock: 30, imageUrl: '/assets/Vitamin C.jpg' },
  { name: 'Sunscreen', price: 18.50, categoryName: 'Skincare', stock: 25, imageUrl: '/assets/Sunscreen.jpg' },
  { name: 'Hand Sanitizer', price: 8.99, categoryName: 'Hygiene', stock: 100, imageUrl: '/assets/HandSanitizer.jpg' },
  { name: 'Face Mask', price: 15.00, categoryName: 'Skincare', stock: 40, imageUrl: '/assets/Face Mask.jpg' },
];

async function seed() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/raia-connect';
  await mongoose.connect(uri);

  // 1. Create categories first
  await CategoryModel.deleteMany({});
  const categoryDocs = await CategoryModel.insertMany(INITIAL_CATEGORIES);
  const categoryByName = new Map(categoryDocs.map((c) => [c.name, c._id]));

  // 2. Create products with categoryId reference
  await ProductModel.deleteMany({});
  const productsWithCategoryId = INITIAL_PRODUCTS.map((p) => {
    const categoryId = categoryByName.get(p.categoryName);
    if (!categoryId) throw new Error(`Category not found: ${p.categoryName}`);
    const { categoryName: _, ...rest } = p;
    return { ...rest, categoryId };
  });
  await ProductModel.insertMany(productsWithCategoryId);

  console.log(`Seeded ${INITIAL_CATEGORIES.length} categories and ${INITIAL_PRODUCTS.length} products`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
