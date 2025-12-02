import { updatePasswordAction } from '@/actions/user/update-user-password-action';
import { Button } from '@/components/Button';
import { InputText } from '@/components/InputText';
import { LockKeyholeIcon } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function UpdateUserPasswordForm() {
  const [state, action, isPending] = useActionState(updatePasswordAction, {
    errors: [],
    success: false,
  });

  useEffect(() => {
    toast.dismiss();

    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error));
    }

    if (state.success) {
      toast.success('Senha alterada com sucesso!');
    }
  }, [state]);

  return (
    <form action={action} className='flex-1 flex flex-col gap-4'>
      <h1 className='text-4xl font-bold'>Alterar senha do usuário</h1>
      <InputText
        type='password'
        name='currentPassword'
        labelText='Senha atual'
        placeholder='Digite sua senha atual'
        disabled={isPending}
        defaultValue={''}
      />
      <InputText
        type='password'
        name='newPassword'
        labelText='Senha nova'
        placeholder='Digite sua senha nova'
        disabled={isPending}
        defaultValue={''}
      />
      <InputText
        type='password'
        name='newPasswordConfirm'
        labelText='Confirmar senha nova'
        placeholder='Confirme sua senha nova'
        disabled={isPending}
        defaultValue={''}
      />
      <div className='flex items-center justify-center mt-4'>
        <Button disabled={isPending} type='submit'>
          <LockKeyholeIcon />
          Atualizar senha
        </Button>
      </div>
    </form>
  );
}
