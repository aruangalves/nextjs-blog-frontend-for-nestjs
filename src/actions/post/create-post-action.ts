'use server';

import { getLoginSessionFromApi } from '@/lib/login/manage-login';
import {
  CreatePostForApiSchema,
  PublicPostForApiDto,
  PublicPostForApiSchema,
} from '@/lib/post/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-msgs';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

type createPostActionState = {
  formState: PublicPostForApiDto;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: createPostActionState,
  formData: FormData,
): Promise<createPostActionState> {
  const isAuthenticated = await getLoginSessionFromApi();

  if (!(formData instanceof FormData)) {
    return {
      formState: { ...prevState.formState },
      errors: ['Dados inválidos'],
    };
  }

  const objFromFormData = Object.fromEntries(formData.entries());

  const zodParsedObj = CreatePostForApiSchema.safeParse(objFromFormData);

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

  const newPostData = zodParsedObj.data;

  const createPostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPostData),
    },
  );

  if (!createPostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(objFromFormData),
      errors: createPostResponse.errors,
    };
  }

  const createdPost = createPostResponse.data;

  revalidateTag('posts');
  redirect(`/admin/post/${createdPost.id}?created=1`);
}
