import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';

export default function NotFound() {
  return (
    <ErrorMessage
      pageTitle='Page not found | The Blog'
      contentTitle='404'
      message={
        <p>
          The page you were looking for could not be found. You can return{' '}
          <Link href='/' className='underline hover:no-underline'>
            home
          </Link>
          .
        </p>
      }
    />
  );
}
