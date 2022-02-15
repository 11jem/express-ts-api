// Everything related to DB calls

import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import Product, {
  ProductDocument,
  ProductInput,
} from '../models/product.model';

export const getBudgetProducts = async () => {
  return await Product.find()
    .sort({ price: 1 })
    .select('title description price')
    .limit(5);
};

export const getAllProducts = async () => {
  return await Product.find();
};

export const getProduct = async (
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  return await Product.findOne(query, {}, options);
};

export const createProduct = async (input: ProductInput) => {
  return await Product.create(input);
};

export const updateProduct = async (
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) => {
  return await Product.findOneAndUpdate(query, update, options);
};

export const deleteProduct = async (query: FilterQuery<ProductDocument>) => {
  return await Product.findOneAndDelete(query);
};
