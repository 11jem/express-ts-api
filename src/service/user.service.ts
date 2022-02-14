// Everything related to DB calls

import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { omit } from 'lodash';
import User, { UserDocument, UserInput } from '../models/user.models';
import { NextFunction } from 'express';
import AppError from '../utils/error';

export const createUser = async (input: UserInput) => {
  return omit((await User.create(input)).toJSON(), 'password');
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // Querying user
  const user = await User.findOne({ email });

  if (!user) return false;

  // Checking password
  if (!(await user.comparePassword(password))) return false;

  return omit(user.toJSON(), 'password');
};

export const findUser = async (query: FilterQuery<UserDocument>) => {
  const user = await User.findOne(query);

  if (user) return omit(user.toJSON(), 'password');
};

export const updateUser = async (
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) => {
  const user = await User.findOneAndUpdate(query, update, options);

  if (user) return omit(user.toJSON(), 'password');
};

export const updateUserPassword = async (
  userId: string,
  update: UpdateQuery<UserDocument>
) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError('No user found.', 404);

  user.password = update.password;
  return await user.save();
};

export const deleteUser = async (query: FilterQuery<UserDocument>) => {
  return await User.findByIdAndDelete(query);
};
