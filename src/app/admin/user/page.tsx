//import { UpdateUser } from '@/components/UpdateUser';
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
      <h1>Update user form</h1>
    </Suspense>
  );
}
