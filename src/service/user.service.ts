// Everything related to DB calls

import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { omit } from 'lodash';
import User, { UserDocument, UserInput } from '../models/user.models';

export const createUser = async (input: UserInput) => {
  try {
    return await User.create(input);
  } catch (err: any) {
    throw new Error(err);
  }
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
  return await User.findOne(query).lean();
};

export const updateUser = async (
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) => {
  return await User.findOneAndUpdate(query, update, options);
};

export const updateUserPassword = async (
  userId: string,
  update: UpdateQuery<UserDocument>
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('No user found');

  user.password = update.password;
  return await user.save();
};

export const deleteUser = async (query: FilterQuery<UserDocument>) => {
  return await User.findByIdAndDelete(query);
};
