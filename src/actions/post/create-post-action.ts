'use server';

import { makePartialPublicPost, PublicPost } from '@/dto/post/dto';
import { verifyLoginSession } from '@/lib/login/manage-login';
import { PostCreateSchema } from '@/lib/post/validations';
import { PostModel } from '@/models/post/post-model';
import { postRepository } from '@/repositories/post';
import { getZodErrorMessages } from '@/utils/get-zod-error-msgs';
import { makeSlugFromText } from '@/utils/make-slug-from-text';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';

type createPostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: string;
};

export async function createPostAction(
  prevState: createPostActionState,
  formData: FormData,
): Promise<createPostActionState> {
  const isAuthenticated = await verifyLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: { ...prevState.formState },
      errors: ['Dados inválidos'],
    };
  }

  const objFromFormData = Object.fromEntries(formData.entries());

  const zodParsedObj = PostCreateSchema.safeParse(objFromFormData);

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

  const newPost: PostModel = {
    ...validPostData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidV4(),
    slug: makeSlugFromText(validPostData.title),
  };

  try {
    await postRepository.create(newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: newPost,
        errors: [e.message],
      };
    }

    return {
      formState: newPost,
      errors: ['Erro desconhecido'],
    };
  }

  revalidateTag('posts');
  redirect(`/admin/post/${newPost.id}?created=1`);

  //unreachable code
  /*return {
    formState: newPost,
    errors: [],
  };*/
}

//Post model - objFromFormData
/**
{
  id: '3993fcf7-2490-48ed-be2e-58c2030ee764',
  slug: 'organizacao-pessoal-por-onde-comecar',
  author: 'Bianca Rocha',
  title: 'Organização pessoal: por onde começar',
  excerpt: 'Por exemplo, ele pode dividir o código em partes menores para que o navegador só carregue o que for necessário.',
  content: 'Por exemplo, ele pode dividir o código em partes menores para que o navegador só carregue o que for necessário.',
  file: File {
    size: 0,
    type: 'application/octet-stream',
    name: 'undefined',
    lastModified: 1762864515339
  },
  coverImageUrl: '/images/bryen_4.png',
  published: 'on'
}
 */
