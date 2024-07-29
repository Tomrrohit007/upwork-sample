import * as z from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(3, { message: 'Name is required' }),
    email: z.string().email().min(3, { message: 'Email is required' }),
    date: z.string().date(),
    password: z
      .string()
      .min(8, { message: 'Password must contain 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export const UpdateSchemaZod = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
  email: z.string().email().min(3, { message: 'Email is required' }),
  date: z.string().date(),
});
