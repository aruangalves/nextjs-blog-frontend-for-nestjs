'use client';

import { Button } from '@/components/Button';

type DialogAdminProps = {
  title: string;
  content: React.ReactNode;
  isVisible?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  disabled: boolean;
};

export function DialogAdmin({
  title,
  content,
  isVisible = false,
  onConfirm,
  onCancel,
  disabled = false,
}: DialogAdminProps) {
  if (!isVisible) return null;

  function handleCancel() {
    if (disabled) return;
    onCancel();
  }
  return (
    <div
      className='fixed z-50 bg-black/50 backdrop-blur-sm inset-0 flex items-center justify-center'
      onClick={handleCancel}
    >
      <div
        className='p-8 bg-slate-100 rounded-2xl max-w-2xl mx-6 flex flex-col gap-12 shadow-lg shadow-slate-800'
        role='dialog'
        aria-modal={true}
        aria-labelledby='dialog-title'
        aria-describedby='dialog-description'
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id='dialog-title' className='text-3xl'>
          {title}
        </h3>
        <div id='dialog-description'>{content}</div>
        <div className='flex items-center justify-around gap-4'>
          <Button variant='default' onClick={onConfirm} disabled={disabled}>
            Yes
          </Button>
          <Button
            autoFocus
            variant='ghost'
            onClick={handleCancel}
            disabled={disabled}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
