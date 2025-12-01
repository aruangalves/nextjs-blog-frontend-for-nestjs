//import { UpdateUser } from '@/components/UpdateUser';
import { SpinLoader } from '@/components/SpinLoader';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Change user password',
};

export default async function AdminUserPasswordPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <h1>Update user PASSWORD form</h1>
    </Suspense>
  );
}
