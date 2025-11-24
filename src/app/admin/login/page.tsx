import { LoginForm } from '@/components/Admin/LoginForm';
import ErrorMessage from '@/components/ErrorMessage';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function AdminLoginPage() {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

  if (!allowLogin) {
    return (
      <ErrorMessage
        pageTitle='403 - Forbidden'
        contentTitle='Error 403 - Forbidden'
        message='O sistema de login está desativado. Solicite a liberação do sistema ao administrador.'
      />
    );
  }

  return (
    <div className='flex items-center justify-center max-w-md mt-16 mb-32 px-8 pb-16 pt-8 mx-auto rounded-2xl bg-slate-200'>
      <LoginForm />
    </div>
  );
}
