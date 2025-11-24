type SpinLoaderProps = {
  className?: string;
};

export function SpinLoader({ className = '' }: SpinLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center $containerClasses ${className}`}
    >
      <div className='w-10 h-10 border-4 border-t-transparent border-slate-900 rounded-full animate-spin'></div>
    </div>
  );
}
