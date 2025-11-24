import { FeaturedPost } from '@/components/FeaturedPost';
import { PostList } from '@/components/PostList';
import { SpinLoader } from '@/components/SpinLoader';
import { Suspense } from 'react';

//this page represents the main route of the application
//every route is represented by its folder name and accessed from the page.tsx file within
//examples:
// app/page.tsx --> / root route
// app/about/page.tsx --> /about route

export default function Home() {
  return (
    <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start pb-16'>
      <Suspense fallback={<SpinLoader className='min-h20 mb-16' />}>
        <FeaturedPost />
        <PostList />
      </Suspense>
    </main>
  );
}
