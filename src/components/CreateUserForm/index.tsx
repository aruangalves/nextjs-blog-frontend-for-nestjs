import { UserRoundIcon } from 'lucide-react';
import { Button } from '../Button';
import { InputText } from '../InputText';
import Link from 'next/link';

export function CreateUserForm() {
  return (
    <div className='flex items-center justify-center text-center max-w-sm mt-16 mb-32 auto'>
      <form action={''} className='flex-1 flex flex-col gap-4'>
        <InputText
          type='text'
          name='name'
          labelText='Nome'
          placeholder='Seu nome'
          disabled={false}
          defaultValue={''}
          required
        />
        <InputText
          type='email'
          name='email'
          labelText='E-mail'
          placeholder='Seu e-mail'
          disabled={false}
          defaultValue={''}
          required
        />
        <InputText
          type='password'
          name='password'
          labelText='Senha'
          placeholder='Sua senha'
          disabled={false}
          defaultValue={''}
          required
        />
        <InputText
          type='password'
          name='passwordConfirm'
          labelText='Confirmar senha'
          placeholder='Confirme sua senha'
          disabled={false}
          defaultValue={''}
          required
        />
        <Button disabled={false} type='submit' className='mt-4'>
          <UserRoundIcon />
          Criar conta
        </Button>
        <p className='text-sm/tight'>
          <Link href={'/login'}>
            Já possui cadastro? Clique aqui para entrar.
          </Link>
        </p>
      </form>
    </div>
  );
}
