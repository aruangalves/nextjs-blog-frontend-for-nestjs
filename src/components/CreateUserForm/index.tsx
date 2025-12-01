'use client';

import { UserRoundIcon } from 'lucide-react';
import { Button } from '../Button';
import { InputText } from '../InputText';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { createUserAction } from '@/actions/user/create-user-action';
import { PublicUserSchema } from '@/lib/user/schemas';
import { toast } from 'react-toastify';
import { HoneypotInput } from '../HoneypotInput';

export function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUserAction, {
    user: PublicUserSchema.parse({}),
    errors: [],
    success: false,
  });

  useEffect(() => {
    toast.dismiss();
    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error));
    }
  }, [state]);

  return (
    <form action={action} className='flex-1 flex flex-col gap-4'>
      <h1 className='text-4xl font-bold'>Criar usuário</h1>
      <InputText
        type='text'
        name='name'
        labelText='Nome'
        placeholder='Seu nome'
        disabled={isPending}
        defaultValue={state.user.name}
        required
      />
      <InputText
        type='email'
        name='email'
        labelText='E-mail'
        placeholder='Seu e-mail'
        disabled={isPending}
        defaultValue={state.user.email}
        required
      />
      <InputText
        type='password'
        name='password'
        labelText='Senha'
        placeholder='Sua senha'
        disabled={isPending}
        defaultValue={''}
        required
      />
      <InputText
        type='password'
        name='passwordConfirm'
        labelText='Confirmar senha'
        placeholder='Confirme sua senha'
        disabled={isPending}
        defaultValue={''}
        required
      />

      <HoneypotInput />
      <Button disabled={isPending} type='submit' className='mt-4'>
        <UserRoundIcon />
        {!isPending && 'Cadastrar usuário'}
        {isPending && 'Cadastrando usuário...'}
      </Button>
      <p className='text-sm/tight'>
        <Link href={'/login'} className='group'>
          Já possui cadastro?{' '}
          <span className='underline group-hover:no-underline'>
            Clique aqui para entrar.
          </span>
        </Link>
      </p>
    </form>
  );
}
