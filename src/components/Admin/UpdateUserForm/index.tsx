'use client';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { InputText } from '@/components/InputText';
import { asyncDelay } from '@/utils/async-delay';
import { LockKeyholeIcon, OctagonXIcon, UserPenIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

export function UpdateUserForm() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isTransitioning, startTransition] = useTransition();
  const safetyDelay = 10000;
  const isElementsDisabled = isTransitioning;

  function showDeleteAccountDialog(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    e.preventDefault();
    setIsDialogVisible(true);
    startTransition(async () => {
      await asyncDelay(safetyDelay);
    });
  }

  function handleDeleteUserAccount() {}

  return (
    <form action={''} className='flex-1 flex flex-col gap-4'>
      <h1 className='text-4xl font-bold'>Editar usuário</h1>
      <InputText
        type='text'
        name='name'
        labelText='Nome'
        placeholder='Seu nome'
        disabled={isElementsDisabled}
        defaultValue={''}
        required
      />
      <InputText
        type='email'
        name='email'
        labelText='E-mail'
        placeholder='Seu e-mail'
        disabled={isElementsDisabled}
        defaultValue={''}
        required
      />
      <Button disabled={isElementsDisabled} type='submit' className='mt-4'>
        <UserPenIcon />
        {!isElementsDisabled && 'Atualizar usuário'}
        {isElementsDisabled && 'Atualizando usuário...'}
      </Button>

      <div className='flex gap-4 items-center justify-between mt-8'>
        <Link
          className='flex gap-2 items-center justify-center transition hover:text-blue-600'
          href='/admin/user/password'
        >
          <LockKeyholeIcon />
          Trocar senha
        </Link>
        <Link
          className='flex gap-2 items-center justify-center transition text-red-600 hover:text-red-700'
          href='#'
          onClick={showDeleteAccountDialog}
        >
          <OctagonXIcon /> Apagar conta
        </Link>
      </div>
      <Dialog
        content={
          <p>
            Ao apagar meu usuário, meus dados e todos os meus posts também serão
            excluídos. Essa ação é <b>IRREVERSÍVEL</b>. Em alguns segundos os
            botões serão liberados. Clique em <b>OK</b> para confirmar ou{' '}
            <b>Cancelar</b> para fechar essa janela.
          </p>
        }
        disabled={isElementsDisabled}
        onCancel={() => setIsDialogVisible(false)}
        onConfirm={handleDeleteUserAccount}
        isVisible={isDialogVisible}
        title='Apagar meu usuário'
      />
      <div></div>
    </form>
  );
}
