import { Request, Response, Next } from 'express';
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from '../service/product.service';

export const getProductHandler = async (
  req: Request<GetProductInput['params'], {}>,
  res: Response
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
