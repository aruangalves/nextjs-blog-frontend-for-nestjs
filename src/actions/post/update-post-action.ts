'use server';

import { getLoginSessionFromApi } from '@/lib/login/manage-login';
import {
  PublicPostForApiDto,
  PublicPostForApiSchema,
  UpdatePostForApiSchema,
} from '@/lib/post/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-msgs';
import { makeRandomString } from '@/utils/make-random-string';
import { revalidateTag } from 'next/cache';

type updatePostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: updatePostActionState,
  formData: FormData,
): Promise<updatePostActionState> {
  const isAuthenticated = await getLoginSessionFromApi();

  if (!(formData instanceof FormData)) {
    return {
      formState: { ...prevState.formState },
      errors: ['Dados inválidos'],
    };
  }

  const id = formData.get('id')?.toString() || '';

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      errors: ['ID inválido'],
    };
  }

  const objFromFormData = Object.fromEntries(formData.entries());

  const zodParsedObj = UpdatePostForApiSchema.safeParse(objFromFormData);

  if (!isAuthenticated) {
    return {
      formState: PublicPostForApiSchema.parse(objFromFormData),
      errors: ['Faça login em outra aba antes de salvar suas alterações.'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error.format());
    return { errors, formState: PublicPostForApiSchema.parse(objFromFormData) };
  }

  const newPost = zodParsedObj.data;

  const updatedPostResponse =
    await authenticatedApiRequest<PublicPostForApiDto>(`/post/me/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(newPost),
      headers: {
        'Content-Type': 'application/json',
      },
    });

  if (!updatedPostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(objFromFormData),
      errors: updatedPostResponse.errors,
    };
  }

  const post = updatedPostResponse.data;
  revalidateTag('posts');
  revalidateTag(`post-${post.slug}`);

  return {
    formState: PublicPostForApiSchema.parse(post),
    errors: [],
    success: makeRandomString(),
  };
}
