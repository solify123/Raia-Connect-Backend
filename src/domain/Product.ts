export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export interface ProductDocument extends Omit<Product, '_id'> {
  _id?: string;
}
