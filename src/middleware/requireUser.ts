import { Request, Response, NextFunction } from 'express';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;
  if (!user)
    res.status(403).json({
      status: 'fail',
      message: 'You are not allowed to access this resource.',
    });

  return next();
};

export default requireUser;
