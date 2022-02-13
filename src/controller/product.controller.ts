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

export const getBestBudgetHandler = async (req: Request, res: Response) => {
  const budgetProducts = await getBudgetProducts();
  if (!budgetProducts) return res.sendStatus(404);

  return res.send(budgetProducts);
};

export const getAllProductsHandler = async (req: Request, res: Response) => {
  const allProducts = await getAllProducts();

  return res.send(allProducts);
};

// trying error handling
// export const getProductHandler = async (
//   req: Request<GetProductInput['params'], {}>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { productId } = req.params;
//     // const product = await getProduct({ productId });
//     const product = await getProduct(next, { _id: 52893648796527834 });

//     // if (!product) return res.sendStatus(404);
//     if (!product) return next(new AppError('no product', 404));

//     return res.send(product);
//   } catch (err) {
//     return next(err);
//   }
// };

export const getProductHandler = async (
  req: Request<GetProductInput['params'], {}>,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const product = await getProduct({ productId });

  if (!product) return res.sendStatus(404);

  return res.send(product);
};

export const createProductHandler = async (
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response
) => {
  const { _id: userId } = res.locals.user;
  const body = req.body;
  const product = await createProduct({ ...body, user: userId });

  return res.send(product);
};

export const updateProductHandler = async (
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
  res: Response
) => {
  const { _id: userId } = res.locals.user;
  const { productId } = req.params;
  const update = req.body;

  const product = await getProduct({ productId });

  if (!product) return res.sendStatus(404);

  if (String(product.user) !== userId) return res.sendStatus(403);

  const updatedProduct = await updateProduct({ productId }, update, {
    new: true,
  });

  return res.send(updatedProduct);
};

export const deleteProductHandler = async (
  req: Request<DeleteProductInput['params']>,
  res: Response
) => {
  const { _id: userId } = res.locals.user;
  const { productId } = req.params;

  const product = await getProduct({ productId });

  if (!product) return res.sendStatus(404);

  if (String(product.user) !== userId) return res.sendStatus(403);

  await deleteProduct({ productId });

  return res.sendStatus(200);
};
