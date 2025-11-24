'use client';

import { deletePostAction } from '@/actions/post/delete-post-action';
import { Trash2Icon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { DialogAdmin } from '../DialogAdmin';
import { toast } from 'react-toastify';

type DeletePostButtonAdminProps = {
  id: string;
  title: string;
};

export function DeletePostButtonAdmin({
  id,
  title,
}: DeletePostButtonAdminProps) {
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);

  function handleClick() {
    setShowDialog(true);
  }

  function handleConfirm() {
    toast.dismiss();

    startTransition(async () => {
      const result = await deletePostAction(id);

      setShowDialog(false);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('The post ' + title + ' was successfully deleted.');
    });
  }

  return (
    <>
      <button
        className='text-red-700 cursor-pointer transition hover:scale-120 hover:text-red-600 disabled:text-gray-800 disabled:cursor-not-allowed'
        aria-label={`Delete post: ${title}`}
        title={`Delete post: ${title}`}
        onClick={handleClick}
        disabled={isPending}
      >
        <Trash2Icon />
      </button>
      {showDialog && (
        <DialogAdmin
          isVisible={showDialog}
          title='Delete post'
          content={
            <p>
              Do you really want to delete the post: <b>{title}</b>?
            </p>
          }
          onCancel={() => setShowDialog(false)}
          onConfirm={() => handleConfirm()}
          disabled={isPending}
        />
      )}
    </>
  );
}
