import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/error';
import logger from '../utils/logger';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Setting default status and status code
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  logger.info(err.message);

  let error = {
    ...err,
    name: err.name,
    code: err.code,
    message: err.message,
  };

  // Operational errors
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      error,
    });
  }

  if (error.name === 'CastError') {
    error = new AppError('Please make sure your request is right.', 400);
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  if (error.code === 11000) {
    error = new AppError('One of the fields is a duplicate.', 400);
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  if (error.name === 'ValidationError') {
    error = new AppError('Invalid input data.', 409);
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  // Other errors
  return res.status(500).json({
    title: 'Something went wrong!',
    error,
  });
};

export default errorHandler;
