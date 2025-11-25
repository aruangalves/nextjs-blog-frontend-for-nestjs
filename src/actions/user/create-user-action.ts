'use server';

import {
  CreateUserSchema,
  PublicUserDto,
  PublicUserSchema,
} from '@/lib/user/schemas';
import { getZodErrorMessages } from '@/utils/get-zod-error-msgs';
import { formatError } from 'zod';

type CreateUserActionState = {
  user: PublicUserDto;
  errors: string[];
  success: boolean;
};

export async function createUserAction(
  state: CreateUserActionState,
  formData: FormData,
): Promise<CreateUserActionState> {
  if (!(formData instanceof FormData)) {
    return {
      user: state.user,
      errors: ['Dados inválidos.'],
      success: false,
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const parsedFormData = CreateUserSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: getZodErrorMessages(formatError(parsedFormData.error)),
      success: false,
    };
  }

  //fetch API from NestJS backend
  const apiUrl = process.env.API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${apiUrl}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedFormData.data),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      return {
        user: PublicUserSchema.parse(formObj),
        errors: jsonResponse.message,
        success: false,
      };
    }

    return {
      user: PublicUserSchema.parse(formObj),
      errors: [],
      success: true,
    };
  } catch (e) {
    console.log(e);

    return {
      user: PublicUserSchema.parse(formObj),
      errors: ['Falha de conexão com o servidor.'],
      success: false,
    };
  }
}
