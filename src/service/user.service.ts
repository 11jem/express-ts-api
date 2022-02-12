// Everything related to DB calls

import { DocumentDefinition, FilterQuery } from 'mongoose';
import { omit } from 'lodash';
import User, { UserDocument } from '../models/user.models';

export const createUser = async (
  input: DocumentDefinition<
    Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>
  >
) => {
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
