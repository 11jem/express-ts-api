import jwt from 'jsonwebtoken';
import config from 'config';

const publicKey = config.get<string>('publicKey');
const privateKey = config.get<string>('privateKey');

export const signJWT = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    };
  }
};
