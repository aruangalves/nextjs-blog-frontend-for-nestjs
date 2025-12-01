'use server';

import { getLoginSessionFromApi } from '@/lib/login/manage-login';
import { PublicPostForApiDto } from '@/lib/post/schemas';
import { authenticatedApiRequest } from '@/utils/authenticated-api-request';
import { error } from 'console';
import { revalidateTag } from 'next/cache';

export async function deletePostAction(id: string) {
  const isAuthenticated = await getLoginSessionFromApi();

  if (!isAuthenticated) {
    return {
      error: 'Faça login antes de continuar.',
    };
  }

  if (!id || typeof id !== 'string') {
    return {
      error: 'Invalid data.',
    };
  }

  const postResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (!postResponse.success) {
    return { error: 'Erro ao encontrar post.' };
  }

  const deletePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(
    `/post/me/${id}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!deletePostResponse.success) {
    return {
      error: 'Erro ao apagar post.',
    };
  }

  revalidateTag('posts');
  revalidateTag(`post-${postResponse.data.slug}`);

  return {
    error: '',
  };
}
