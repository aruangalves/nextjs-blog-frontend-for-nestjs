'use server';

import {
  makePartialPublicPost,
  makePublicPostFromDb,
  PublicPost,
} from '@/dto/post/dto';
import { verifyLoginSession } from '@/lib/login/manage-login';
import { PostUpdateSchema } from '@/lib/post/schemas';
import { postRepository } from '@/repositories/post';
import { getZodErrorMessages } from '@/utils/get-zod-error-msgs';
import { makeRandomString } from '@/utils/make-random-string';
import { revalidateTag } from 'next/cache';

type updatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function updatePostAction(
  prevState: updatePostActionState,
  formData: FormData,
): Promise<updatePostActionState> {
  const isAuthenticated = await verifyLoginSession();

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

  const zodParsedObj = PostUpdateSchema.safeParse(objFromFormData);

  if (!isAuthenticated) {
    return {
      formState: makePartialPublicPost(objFromFormData),
      errors: ['Faça login em outra aba antes de salvar suas alterações.'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error.format());
    return { errors, formState: makePartialPublicPost(objFromFormData) };
  }

  const validPostData = zodParsedObj.data;

  const updatedPost = {
    ...validPostData,
  };

  let post;
  try {
    post = await postRepository.update(id, updatedPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makePartialPublicPost(objFromFormData),
        errors: [e.message],
      };
    }

    return {
      formState: makePartialPublicPost(objFromFormData),
      errors: ['Erro desconhecido'],
    };
  }

  revalidateTag('posts');
  revalidateTag(`post-${post.slug}`);

  return {
    formState: makePublicPostFromDb(post),
    errors: [],
    success: makeRandomString(),
  };
}
