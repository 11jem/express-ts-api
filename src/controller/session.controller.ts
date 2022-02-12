import { Request, Response } from 'express';
import config from 'config';
import {
  createSession,
  getSessions,
  updateSession,
} from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { signJWT } from '../utils/jwt.utils';

export const createUserSessionHandler = async (req: Request, res: Response) => {
  // Validate the user's password
  const user = await validatePassword(req.body); // body needs email and pw

  if (!user)
    return res.status(401).json({
      status: 'error',
      error: 'Invalid email or password',
    });

  // Create a session
  const session = await createSession(
    user._id,
    (req.get('user-agent') as string) || ''
  );

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

  // Create a refresh token
  const refreshToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('refreshTokenTtl'), // 1yr
    }
  );

  // Return access and refresh tokens
  res.send({ accessToken, refreshToken });
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
  // const userId = res.locals.user._id;
  const {
    user: { _id },
  } = res.locals;

  const sessions = await getSessions({ user: _id, valid: true });

  return res.send(sessions);
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  const { session: sessionId } = res.locals.user;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};
