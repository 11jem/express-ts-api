import { object, number, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *        - title
 *        - description
 *        - price
 *        - image
 *      properties:
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        price:
 *          type: number
 *        image:
 *          type: string
 */

const payload = {
  body: object({
    title: string({
      required_error: 'A product must have a title',
    }),
    description: string({
      required_error: 'A product must have a description',
    }).min(120, 'Description should be at least 120 characters long'),
    price: number({
      required_error: 'A product must have a price',
    }),
    image: string({
      required_error: 'A product must have an image',
    }),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: 'productId is required',
    }),
  }),
};

export const getProductSchema = object({
  ...params,
});

export const createProductSchema = object({
  ...payload,
});

export const updateProductSchema = object({
  ...payload,
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export type GetProductInput = TypeOf<typeof getProductSchema>;
export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;
