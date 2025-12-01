import { PostCoverImage } from '../PostCoverImage';
import { PostHeading } from '../PostHeading';
import { findAllPublicPostsFromApiCached } from '@/lib/post/queries/public';
import { PostDate } from '../PostDate';

export async function PostList() {
  const postResponse = await findAllPublicPostsFromApiCached();
  if (!postResponse.success) {
    return (
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'></div>
    );
  }

  const posts = postResponse.data;

  if (posts.length > 0) {
    return (
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => {
          const postUrl = `/post/${post.slug}`;
          return (
            <article key={post.id} className='flex flex-col gap-4 group'>
              <PostCoverImage
                linkProps={{
                  href: postUrl,
                }}
                imageProps={{
                  width: 1200,
                  height: 720,
                  src: post.coverImageUrl,
                  alt: post.title,
                }}
              />
              <PostDate
                date={post.createdAt}
                className='text-slate-600 text-sm/tight mb-0.5'
              />
              <PostHeading href={postUrl} as='h3'>
                {post.title}
              </PostHeading>

              <p>{post.excerpt}</p>
            </article>
          );
        })}
      </div>
    );
  } else {
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'></div>;
  }
}
