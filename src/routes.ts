import { Express, Request, Response } from 'express';
import errorHandler from './controller/error.controller';
import {
  createProductHandler,
  deleteProductHandler,
  getAllProductsHandler,
  getBestBudgetHandler,
  getProductHandler,
  updateProductHandler,
} from './controller/product.controller';
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from './controller/session.controller';
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  updateUserHandler,
  updateUserPasswordHandler,
} from './controller/user.controller';
import requireUser from './middleware/requireUser';
import validateResource from './middleware/validateResource';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schema/product.schema';
import { createSessionSchema } from './schema/session.schema';
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from './schema/user.schema';

const routes = (app: Express) => {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

  // Users routes
  app.post('/api/users', validateResource(createUserSchema), createUserHandler);
  app.get(
    '/api/users/:userId',
    validateResource(getUserSchema),
    getUserHandler
  );
  app.patch(
    '/api/users/:userId',
    requireUser,
    validateResource(updateUserSchema),
    updateUserHandler
  );
  app.patch(
    '/api/users/:userId/password',
    requireUser,
    validateResource(updateUserPasswordSchema),
    updateUserPasswordHandler
  );
  app.delete(
    '/api/users/:userId',
    requireUser,
    validateResource(deleteUserSchema),
    deleteUserHandler
  );

  // Sessions routes
  app.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler
  );
  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  // Products routes
  app.get('/api/products/best-budget-cameras', getBestBudgetHandler);
  app.get('/api/products', getAllProductsHandler);
  app.post(
    '/api/products',
    requireUser,
    validateResource(createProductSchema),
    createProductHandler
  );
  app.get(
    '/api/products/:productId',
    validateResource(getProductSchema),
    getProductHandler
  );
  app.put(
    '/api/products/:productId',
    requireUser,
    validateResource(updateProductSchema),
    updateProductHandler
  );
  app.delete(
    '/api/products/:productId',
    requireUser,
    validateResource(deleteProductSchema),
    deleteProductHandler
  );

  // Error handling
  app.use(errorHandler);
};

export default routes;
