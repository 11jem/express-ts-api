// Everything related to DB calls

import { FilterQuery, UpdateQuery } from 'mongoose';
import { get } from 'lodash';
import config from 'config';
import Session, { SessionDocument } from '../models/session.model';
import { signJWT, verifyJWT } from '../utils/jwt.utils';
import { findUser } from './user.service';

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });

  // returning just the object
  return session.toJSON();
};

export const getSessions = async (query: FilterQuery<SessionDocument>) => {
  // lean will not return all the functions on the object, just the object
  return Session.find(query).lean();
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return await Session.findOneAndUpdate(query, update);
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  // Validating token and session id
  const { decoded } = verifyJWT(refreshToken);
  if (!decoded || !get(decoded, 'session')) return false;

  // Querying the session document
  const session = await Session.findById(get(decoded, 'session'));
  if (!session || !session.valid) return false;

  // Querying the user
  const user = await findUser({ _id: session.user });
  if (!user) return false;

  // Create an access token
  const accessToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('accessTokenTtl'), // 15min
    }
  );

  return accessToken;
};
