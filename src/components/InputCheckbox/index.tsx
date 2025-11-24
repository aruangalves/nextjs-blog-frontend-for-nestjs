import { useId } from 'react';

type InputCheckboxProps = {
  labelText?: string;
  type?: 'checkbox';
} & React.ComponentProps<'input'>;

export function InputCheckbox({
  labelText = '',
  type = 'checkbox',
  ...props
}: InputCheckboxProps) {
  const id = useId();

  return (
    <div className='flex items-center gap-2 py-4'>
      <input
        {...props}
        className={
          'rounded-md bg-slate-50 w-5 h-5 focus:ring-sky-600 focus:ring-2 cursor-pointer' +
          ' ' +
          props.className
        }
        id={id}
        type={type}
      />
      {labelText && (
        <label htmlFor={id} className='font-bold text-slate-600'>
          {labelText}
        </label>
      )}
    </div>
  );
}
