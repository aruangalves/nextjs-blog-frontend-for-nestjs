import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email({ message: 'E-mail inválido.' }),
  password: z
    .string()
    .trim()
    .min(3, 'Senha precisa ter um mínimo de 3 caracteres.'),
});
