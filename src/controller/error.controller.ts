import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(err.message);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
  });
};

export default errorHandler;
