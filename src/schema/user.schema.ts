import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Users must have a name',
    }),
    password: string({
      required_error: 'Users must have a password',
    }).min(6, 'Password must have a minimum of 6 characters'),
    passwordConfirm: string({
      required_error: 'passwordConfirm is required',
    }),
    email: string({
      required_error: 'Users must have an email',
    }).email('Not a valid email'),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirm'
>;
