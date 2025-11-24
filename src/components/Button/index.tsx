type ButtonVariants = 'default' | 'ghost' | 'danger';

type ButtonProps = {
  variant?: ButtonVariants;
} & React.ComponentProps<'button'>;

export function Button({
  children,
  variant = 'default',
  ...props
}: ButtonProps) {
  const buttonVariants = {
    default:
      'border-blue-700 bg-blue-700 text-slate-50 hover:border-blue-800 hover:bg-blue-800 disabled:bg-slate-400 disabled:border-slate-400',
    ghost:
      'border-slate-800 hover:bg-slate-200 disabled:border-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100',
    danger:
      'border-red-700 bg-red-700 text-slate-50 hover:border-red-800 hover:bg-red-800 disabled:bg-red-300 disabled:border-red-300 ',
  };

  const commonButtonClasses =
    'rounded-[0.5rem] border-2 px-12 py-4 min-w-40 font-bold text-[1.15rem] transition hover:cursor-pointer flex items-center justify-center disabled:cursor-not-allowed flex items-center justify-center gap-2 [&_svg]:w-6 [&_svg]:h-6';

  const buttonClasses =
    buttonVariants[variant] + ' ' + commonButtonClasses + ' ' + props.className;

  return (
    <button {...props} className={buttonClasses}>
      {children}
    </button>
  );
}
