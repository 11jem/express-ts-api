import { NextFunction, Request, Response } from 'express';
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
import AppError from '../utils/error';

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body);

    return res.status(201).json({
      status: 'success',
      user,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const getUserHandler = async (
  req: Request<GetUserInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await findUser({ _id: userId });
    if (!user) return next(new AppError('No user found.', 404));

    return res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const updateUserHandler = async (
  req: Request<UpdateUserInput['params'], {}, UpdateUserInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const update = req.body;

    const user = await updateUser({ _id: userId }, update, {
      new: true,
    });

    if (!user) return next(new AppError('No user found.', 404));

    if (String(user._id) !== userId)
      return next(
        new AppError('You are not authorized to perform this action.', 403)
      );

    return res.status(200).json({
      status: 'success',
      updatedUser: user,
    });
  } catch (err: any) {
    return next(err);
  }
};

export const updateUserPasswordHandler = async (
  req: Request<
    UpdateUserPasswordInput['params'],
    {},
    UpdateUserPasswordInput['body']
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const updatePassword = req.body;

    await updateUserPassword(userId, updatePassword);

    return res.status(200).json({
      status: 'success',
      message: 'Password successfully updated',
    });
  } catch (err: any) {
    return next(err);
  }
};

export const deleteUserHandler = async (
  req: Request<DeleteUserInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await deleteUser({ _id: userId });

    if (!user) return next(new AppError('No user found.', 404));

    if (String(user._id) !== userId)
      return next(
        new AppError('You are not authorized to perform this action.', 403)
      );

    return res.status(200).json({
      status: 'success',
    });
  } catch (err: any) {
    return next(err);
  }
};
