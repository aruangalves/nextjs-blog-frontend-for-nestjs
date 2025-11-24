import { PostListAdmin } from '@/components/Admin/PostListAdmin';
import { SpinLoader } from '@/components/SpinLoader';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manage Posts',
};

export default async function AdminPostPage() {
  return (
    <div className='pt-8'>
      <h1 className='text-4xl'>Posts</h1>
      <section className='py-4'>
        <Suspense fallback={<SpinLoader />}>
          <PostListAdmin />
        </Suspense>
      </section>
    </div>
  );
}
