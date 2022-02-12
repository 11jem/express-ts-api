import { Request, Response } from 'express';
import { omit } from 'lodash';
import logger from '../utils/logger';
import { createUser } from '../service/user.service';
import { CreateUserInput } from '../schema/user.schema';

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) => {
  try {
    const user = omit((await createUser(req.body)).toJSON(), 'password');
    // return res.send(user)
    return res.status(201).json({
      status: 'sucess',
      data: {
        user,
      },
    });
  } catch (err: any) {
    logger.error(err);
    // return res.status(409).send(err.message);
    // 409 means conflict, violated unique restriction
    return res.status(409).json({
      status: 'error',
      error: err.message,
    });
  }
};
