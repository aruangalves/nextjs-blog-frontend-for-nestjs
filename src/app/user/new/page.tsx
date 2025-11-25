import { CreateUserForm } from '@/components/CreateUserForm';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Criar usuário',
};

export default async function CreateUserPage() {
  return (
    <div className='flex items-center justify-center max-w-md mt-16 mb-32 px-8 pb-16 pt-8 mx-auto rounded-2xl bg-slate-200'>
      <CreateUserForm />
    </div>
  );
}
