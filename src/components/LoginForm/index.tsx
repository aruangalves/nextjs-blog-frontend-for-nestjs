'use client';

import { loginAction } from '@/actions/login/login-action';
import { Button } from '@/components/Button';
import { InputText } from '@/components/InputText';
import { LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function LoginForm() {
  const initialState = {
    email: '',
    errors: [],
  };
  const [loginState, action, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const userChanged = searchParams.get('userChanged');
  const created = searchParams.get('created');

  useEffect(() => {
    if (userChanged === '1') {
      toast.dismiss();
      toast.success('Seu usuário foi modificado. Faça login novamente.');
      const url = new URL(window.location.href);
      url.searchParams.delete('userChanged');
      router.replace(url.toString());
    }

    if (created === '1') {
      toast.dismiss();
      toast.success('Seu usuário foi criado.');
      const url = new URL(window.location.href);
      url.searchParams.delete('created');
      router.replace(url.toString());
    }
  }, [userChanged, created, router]);

  return (
    <form action={action} className='flex-1 flex flex-col gap-4 pb-8'>
      <h1 className='text-4xl font-bold'>Login</h1>
      <InputText
        type='email'
        name='email'
        labelText='E-mail'
        placeholder='Digite seu e-mail'
        disabled={isPending}
        defaultValue={loginState.email}
        required
      />
      <InputText
        type='password'
        name='password'
        labelText='Senha'
        placeholder='Digite sua senha'
        disabled={isPending}
        required
      />
      <Button disabled={isPending} type='submit' className='mt-8'>
        <LogInIcon /> Entrar
      </Button>

      <p className='text-sm/tight'>
        <Link href={'/user/new'} className='group'>
          Não possui cadastro?{' '}
          <span className='underline group-hover:no-underline'>
            Clique aqui para criar sua conta.
          </span>
        </Link>
      </p>

      {loginState.errors.length > 0 && (
        <p className='text-red-700 text-center p-4 mt-4 bg-slate-100 rounded-[0.5rem] border border-slate-300'>
          {loginState.errors.map((error, index) => {
            return (
              <span key={`loginerr-${index}`}>
                {error}
                <br />
              </span>
            );
          })}
        </p>
      )}
    </form>
  );
}
