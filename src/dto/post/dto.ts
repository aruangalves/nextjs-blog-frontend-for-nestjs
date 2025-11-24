import { PostModel } from '@/models/post/post-model';

export type PublicPost = Omit<PostModel, 'updatedAt'>;

export const makePartialPublicPost = (
  post?: Partial<PostModel>,
): PublicPost => {
  return {
    id: post?.id || '',
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImageUrl: post?.coverImageUrl || '',
    published: post?.published || false,
    createdAt: post?.createdAt || '',
    author: post?.author || '',
  };
};

export const makePublicPostFromDb = (post: PostModel): PublicPost => {
  return makePartialPublicPost(post);
};
