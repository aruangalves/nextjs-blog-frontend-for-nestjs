import { UpdateUser } from '@/components/Admin/UpdateUser';
import { SpinLoader } from '@/components/SpinLoader';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit user',
};

export default async function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <div className='flex items-center justify-center max-w-md mt-16 mb-32 px-8 pb-16 pt-8 mx-auto rounded-2xl bg-slate-200'>
        <UpdateUser />
      </div>
    </Suspense>
  );
}
