import Link from 'next/link';

export function Footer() {
  return (
    <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center pt-6 pb-12 bg-slate-900 text-slate-200'>
      <p className='text-[1.15rem] font-semibold'>
        Copyright &copy; {new Date().getFullYear()} -{' '}
        <Link href='/' className='hover:underline hover:text-slate-50'>
          The Blog{' '}
        </Link>
      </p>
    </footer>
  );
}
