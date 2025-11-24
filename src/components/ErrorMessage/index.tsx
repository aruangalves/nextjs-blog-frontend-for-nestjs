type ErrorMessageProps = {
  pageTitle?: string;
  contentTitle: string;
  message: React.ReactNode;
};

export default function ErrorMessage({
  pageTitle = '',
  contentTitle,
  message,
}: ErrorMessageProps) {
  let titleNode = <h1 className='text-4xl'>{contentTitle}</h1>;

  if (contentTitle === '404') {
    titleNode = (
      <>
        <h1 className='text-9xl'>{contentTitle}</h1>
        <p className='text-3xl font-bold'>Error: page not found</p>
      </>
    );
  }

  return (
    <>
      {!!pageTitle && <title>{pageTitle}</title>}
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start pb-16 min-h-dvh'>
        {titleNode}
        <section className='pt-4'>{message}</section>
      </main>
    </>
  );
}
