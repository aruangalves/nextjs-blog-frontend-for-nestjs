import { PostDate } from '../../PostDate';
import { findAllPostsAdmin } from '@/lib/post/queries/admin';
import Link from 'next/link';
import { DeletePostButtonAdmin } from '../DeletePostButtonAdmin';

export async function PostListAdmin() {
  const posts = await findAllPostsAdmin();

  if (posts.length > 0) {
    return (
      <div className='grid grid-cols-1 gap-1'>
        <div className='grid grid-cols-[3fr_1fr_1fr_4rem] font-bold text-[1.05rem] gap-1 [&_p]:bg-slate-600 [&_p]:px-2 [&_p]:py-2 [&_p]:rounded-[0.15rem] [&_p]:text-slate-50'>
          <p>Post title</p>
          <p>Creation date</p>
          <p>Last edit</p>
          <p className='text-center'>Delete</p>
        </div>
        {posts.map((post) => {
          const cssStyling = 'bg-slate-300 py-4 px-2 rounded-[0.15rem]';
          return (
            <article
              key={post.id}
              className='grid grid-cols-[3fr_1fr_1fr_4rem] gap-1'
            >
              <p className={cssStyling}>
                <Link
                  href={`/admin/post/${post.id}`}
                  className='hover:underline'
                >
                  {post.title}
                </Link>{' '}
                {!post.published && (
                  <span className='text-slate-600 italic text-sm'>
                    (Não publicado)
                  </span>
                )}
              </p>

              <PostDate date={post.createdAt} className={cssStyling} />

              <PostDate date={post.updatedAt} className={cssStyling} />

              <div className={`${cssStyling} flex flex-row justify-center`}>
                <DeletePostButtonAdmin id={post.id} title={post.title} />
              </div>
            </article>
          );
        })}
      </div>
    );
  } else {
    <div className='grid grid-cols-1 gap-8'>
      The blog still doesn&apos;t have any posts
    </div>;
  }
}
