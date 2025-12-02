'use server';

import { deleteLoginSession } from '@/lib/login/manage-login';
import { getUserFromApi } from '@/lib/user/api/get-user';
import {
  PublicUserDto,
  PublicUserSchema,
  UpdateUserSchema,
} from '@/lib/user/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-msgs';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { formatError } from 'zod';

type UpdateUserActionState = {
  user: PublicUserDto;
  errors: string[];
  success: boolean;
};

export async function updateUserAction(
  state: UpdateUserActionState,
  formData: FormData,
): Promise<UpdateUserActionState> {
  const user = await getUserFromApi();

  if (!user) {
    await deleteLoginSession();

    return {
      user: state.user,
      errors: ['Você precisa fazer login novamente.'],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      user: state.user,
      errors: ['Dados inválidos.'],
      success: false,
    };
  }

  const formObj = Object.fromEntries(formData.entries());
  const parsedFormData = UpdateUserSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: getZodErrorMessages(formatError(parsedFormData.error)),
      success: false,
    };
  }

  const updateResponse = await authenticatedApiRequest<PublicUserDto>(
    `/user/me`,
    {
      method: 'PATCH',
      body: JSON.stringify(parsedFormData.data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!updateResponse.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: updateResponse.errors,
      success: false,
    };
  }

  if (user.name !== updateResponse.data.name) {
    revalidateTag('posts');
  }

  if (user.email !== updateResponse.data.email) {
    await deleteLoginSession();
    redirect('/login?userChanged=1');
  }

  return {
    user: PublicUserSchema.parse(updateResponse.data),
    errors: [],
    success: true,
  };
}
