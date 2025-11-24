import { postRepository } from '@/repositories/post';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

//React cache removes duplicated calls from the same API or repo
//Useful when you need to invoke the same database query more than once
export const findAllPublicPostsCached = cache(
  unstable_cache(
    async () => {
      return await postRepository.findAllPublishedPublic();
    },
    ['posts'],
    {
      tags: ['posts'],
    },
  ),
);

export const findPublicPostBySlugCached = cache((slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const post = await postRepository
        .findBySlugPublic(slug)
        .catch(() => undefined);

      if (!post) notFound();

      return post;
    },
    [`post-${slug}`],
    { tags: [`post-${slug}`] },
  )(slug);
});
