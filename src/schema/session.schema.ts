import { object, string } from 'zod';

export const createSessionSchema = object({
  body: object({
    password: string({
      required_error: 'Please provide a password',
    }),
    email: string({
      required_error: 'Please provide an email',
    }),
  }),
});
