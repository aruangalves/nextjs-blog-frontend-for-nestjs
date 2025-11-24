import { useId } from 'react';

type InputTextProps = {
  labelText?: string;
} & React.ComponentProps<'input'>;

export function InputText({ labelText = '', ...props }: InputTextProps) {
  const id = useId();

  return (
    <div className='flex flex-col gap-2 py-2'>
      {labelText && (
        <label htmlFor={id} className='font-bold text-slate-600'>
          {labelText}
        </label>
      )}
      <input
        {...props}
        id={id}
        className={
          'p-2 rounded-md bg-slate-50 outline-0 ring-2 cursor-text ring-slate-600 text-slate-800 transition focus:ring-sky-600 placeholder-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400 read-only:cursor-default read-only:bg-slate-200' +
          ' ' +
          props.className
        }
      />
    </div>
  );
}
