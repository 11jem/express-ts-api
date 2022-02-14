import { object, string, TypeOf } from 'zod';

const payload = {
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
};

const params = {
  params: object({
    userId: string({
      required_error: 'userId is required',
    }),
  }),
};

export const getUserSchema = object({
  ...params,
});

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirm
 *      properties:
 *        email:
 *          type: string
 *          default: jennie@example.com
 *        name:
 *          type: string
 *          default: Jennie Kim
 *        password:
 *          type: string
 *          default: password123
 *        passwordConfirm:
 *          type: string
 *          default: password123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export const createUserSchema = object({
  ...payload,
});

// Only email and name update
export const updateUserSchema = object({
  body: object({
    name: string({
      required_error: 'Users must have a name',
    }),
    email: string({
      required_error: 'Users must have an email',
    }).email('Not a valid email'),
  }),
  ...params,
});

export const updateUserPasswordSchema = object({
  body: object({
    password: string({
      required_error: 'Users must have a password',
    }).min(6, 'Password must have a minimum of 6 characters'),
    passwordConfirm: string({
      required_error: 'passwordConfirm is required',
    }),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  }),
  ...params,
});

export const deleteUserSchema = object({
  ...params,
});

export type GetUserInput = Omit<
  TypeOf<typeof getUserSchema>,
  'body.passwordConfirm'
>;

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirm'
>;

export type UpdateUserInput = Omit<
  TypeOf<typeof updateUserSchema>,
  'body.passwordConfirm'
>;

export type UpdateUserPasswordInput = Omit<
  TypeOf<typeof updateUserPasswordSchema>,
  'body.passwordConfirm'
>;

export type DeleteUserInput = Omit<
  TypeOf<typeof deleteUserSchema>,
  'body.passwordConfirm'
>;
