import * as z from 'zod';

export const schema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters'),

    email: z
      .string()
      .email('Invalid email address'),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),

    rePassword: z.string(),

    phone: z
      .string()
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'Enter valid Egyptian phone number'),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ['rePassword'],
  });