import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { UserDocument } from './user.models';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

// interface for product input
export interface ProductInput {
  user: UserDocument['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
}

// interace for productSchema
export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${nanoid()}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      default: true,
    },
    description: {
      type: String,
      default: true,
    },
    price: {
      type: Number,
      default: true,
    },
    image: {
      type: String,
      default: true,
    },
  },
  {
    // Automatic createdAt and updatedAt
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDocument>('Product', productSchema);

export default Product;
