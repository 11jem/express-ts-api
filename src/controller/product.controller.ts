import { NextFunction, Request, Response } from 'express';
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBudgetProducts,
  getProduct,
  updateProduct,
} from '../service/product.service';
import AppError from '../utils/error';

export const getBestBudgetHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const budgetProducts = await getBudgetProducts();
    if (!budgetProducts)
      return next(new AppError('Page could not be found.', 404));

    return res.status(200).json({
      status: 'sucess',
      budgetProducts,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const getAllProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allProducts = await getAllProducts();
    if (!allProducts)
      return next(
        new AppError('There are no products in this collection.', 404)
      );

    return res.status(200).json({
      status: 'success',
      results: allProducts.length,
      products: allProducts,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const getProductHandler = async (
  req: Request<GetProductInput['params'], {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await getProduct({ productId });
    if (!product) return next(new AppError('Product does not exist.', 404));

    return res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const createProductHandler = async (
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: userId } = res.locals.user;
    const body = req.body;
    const product = await createProduct({ ...body, user: userId });

    return res.status(201).json({
      status: 'success',
      product,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const updateProductHandler = async (
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: userId } = res.locals.user;
    const { productId } = req.params;
    const update = req.body;

    const product = await getProduct({ productId });

    if (!product) return next(new AppError('Product does not exist.', 404));

    if (String(product.user) !== userId)
      return next(
        new AppError('You are not authorized to update this product!', 401)
      );

    const updatedProduct = await updateProduct({ productId }, update, {
      new: true,
    });

    return res.status(200).json({
      status: 'success',
      updatedProduct,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const deleteProductHandler = async (
  req: Request<DeleteProductInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: userId } = res.locals.user;
    const { productId } = req.params;

    const product = await getProduct({ productId });

    if (!product) return next(new AppError('Product does not exist.', 404));

    if (String(product.user) !== userId)
      return next(
        new AppError('You are not authorized to delete this product!', 403)
      );

    await deleteProduct({ productId });

    return res.status(200).json({
      status: 'success',
    });
  } catch (err: any) {
    return next(err);
  }
};
