import { Request, Response } from 'express';
import { omit } from 'lodash';
import logger from '../utils/logger';
import {
  createUser,
  deleteUser,
  findUser,
  updateUser,
  updateUserPassword,
} from '../service/user.service';
import {
  CreateUserInput,
  DeleteUserInput,
  GetUserInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from '../schema/user.schema';

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

export const getUserHandler = async (
  req: Request<GetUserInput['params']>,
  res: Response
) => {
  const { userId } = req.params;
  const user = await findUser({ _id: userId });

  if (!user) return res.sendStatus(404);

  return res.send(user);
};

export const updateUserHandler = async (
  req: Request<UpdateUserInput['params'], {}, UpdateUserInput['body']>,
  res: Response
) => {
  const { userId } = req.params;
  const update = req.body;

  const user = await updateUser({ _id: userId }, update, { new: true });
  if (!user) return res.sendStatus(404);
  if (String(user._id) !== userId) return res.sendStatus(403);

  return res.send(omit(user.toJSON(), 'password'));
};

export const updateUserPasswordHandler = async (
  req: Request<
    UpdateUserPasswordInput['params'],
    {},
    UpdateUserPasswordInput['body']
  >,
  res: Response
) => {
  const { userId } = req.params;
  const updatePassword = req.body;

  const newPassword = await updateUserPassword(userId, updatePassword);

  return res.send(omit(newPassword.toJSON(), 'password'));
};

export const deleteUserHandler = async (
  req: Request<DeleteUserInput['params']>,
  res: Response
) => {
  const { userId } = req.params;
  const user = await deleteUser({ _id: userId });

  if (!user) return res.sendStatus(404);
  if (String(user._id) !== userId) return res.sendStatus(403);

  return res.sendStatus(200);
};
