//import { UpdateUser } from '@/components/UpdateUser';
import { UpdateUserPasswordForm } from '@/components/Admin/UpdateUserPasswordForm';
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
      <div className='flex items-center justify-center max-w-md mt-16 mb-32 px-8 pb-16 pt-8 mx-auto rounded-2xl bg-slate-200'>
        <UpdateUserPasswordForm />
      </div>
    </Suspense>
  );
}
