'use client';

import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';
import { useEffect } from 'react';

type RootErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function RootErrorPage({ error }: RootErrorPageProps) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <ErrorMessage
      pageTitle={'Internal Server Error | The Blog'}
      contentTitle={'501 | Internal Server Error'}
      message={
        <p>
          The server encountered an error while processing your request.{' '}
          <Link href='/'>Return home</Link> or try again later.
        </p>
      }
    />
  );
}
