import { ManagePostForm } from '@/components/Admin/ManagePostForm';
import { findPostByIdFromApiAdmin } from '@/lib/post/queries/admin';
import { PublicPostForApiSchema } from '@/lib/post/schemas';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar post',
};

type AdminPostIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminPostIdPage({
  params,
}: AdminPostIdPageProps) {
  const { id } = await params;
  const postsResponse = await findPostByIdFromApiAdmin(id);

  if (!postsResponse.success) {
    notFound();
  }

  const post = postsResponse.data;
  const publicPost = PublicPostForApiSchema.parse(post);

  return (
    <div className='pb-8'>
      <h1 className='text-4xl font-bold pt-4 pb-8'>Editar Post</h1>
      <ManagePostForm mode='update' publicPost={publicPost} />
    </div>
  );
}
