'use client';

import { loginAction } from '@/actions/login/login-action';
import { Button } from '@/components/Button';
import { InputText } from '@/components/InputText';
import { LogInIcon } from 'lucide-react';
import { useActionState } from 'react';

export function LoginForm() {
  const initialState = {
    username: '',
    error: '',
  };
  const [loginState, action, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={action} className='flex-1 flex flex-col gap-4 pb-8'>
      <h1 className='text-4xl font-bold'>Login</h1>
      <InputText
        type='text'
        name='username'
        labelText='Usuário'
        placeholder='Nome de usuário'
        disabled={isPending}
        defaultValue={loginState.username}
      />
      <InputText
        type='password'
        name='password'
        labelText='Senha'
        placeholder='Digite sua senha'
        disabled={isPending}
      />
      <Button disabled={isPending} type='submit' className='mt-8'>
        <LogInIcon /> Entrar
      </Button>

      {!!loginState.error && (
        <p className='text-red-700 text-center p-4 mt-4 bg-slate-100 rounded-[0.5rem] border border-slate-300'>
          {loginState.error}
        </p>
      )}
    </form>
  );
}
