import { z } from 'zod';

// User validation base
// Required for .refine and .transform
// Check if both password fields are equal and remove password repetition (backend only needs a single password field)

const passwordErrorMsg = 'Senha precisa ter pelo menos seis caracteres.';
const passwordConfirmErrorMsg =
  'A confirmação de senha precisa ter pelo menos seis caracteres.';
const passwordsNotEqualErrorMsg =
  'Ambos os campos de senha precisam ser iguais.';

const CreateUserBase = z.object({
  name: z
    .string()
    .trim()
    .min(4, 'Nome de usuário precisa ter pelo menos quatro caracteres.'),
  email: z.email({ message: 'Email inválido.' }).trim(),
  password: z.string().trim().min(6, passwordErrorMsg),
  passwordConfirm: z.string().trim().min(6, passwordConfirmErrorMsg),
});

export const CreateUserSchema = CreateUserBase.refine(
  (data) => {
    //Password fields are equal?
    return data.password === data.passwordConfirm;
  },
  {
    path: ['passwordConfirm'], //which field should point the error
    message: passwordsNotEqualErrorMsg,
  },
).transform(({ email, name, password }) => {
  //removes passwordConfirm field to serve the backend
  return {
    name,
    email,
    password,
  };
});

export const PublicUserSchema = z.object({
  id: z.string().default(''),
  name: z.string().default(''),
  email: z.string().default(''),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(6, passwordErrorMsg),
    newPassword: z
      .string()
      .trim()
      .min(6, 'Nova senha precisa ter pelo menos seis caracteres.'),
    newPasswordConfirm: z.string().trim().min(6, passwordConfirmErrorMsg),
  })
  .refine(
    (data) => {
      //NEW password fields are equal?
      return data.newPassword === data.newPasswordConfirm;
    },
    {
      path: ['newPasswordConfirm'], //which field should point the error
      message: passwordsNotEqualErrorMsg,
    },
  )
  .transform(({ currentPassword, newPassword }) => {
    //removes newPasswordConfirm field to serve the backend
    return { currentPassword, newPassword };
  });

export const UpdateUserSchema = CreateUserBase.omit({
  password: true,
  passwordConfirm: true,
}).extend({});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type PublicUserDto = z.infer<typeof PublicUserSchema>;
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
