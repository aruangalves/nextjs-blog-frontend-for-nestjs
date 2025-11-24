import Link from 'next/link';

type PostHeadingProps = {
  children: React.ReactNode;
  href?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function PostHeading({
  children,
  href = '#',
  as: HeadingTag = 'h2',
}: PostHeadingProps) {
  const headingCLassesMap = {
    h1: 'text-3xl/tight sm:text-6xl',
    h2: 'text-2xl/tight sm:text-4xl',
    h3: 'text-2xl/tight sm:text-2xl',
    h4: 'text-2xl/tight sm:text-2xl',
    h5: 'text-2xl/tight sm:text-2xl',
    h6: 'text-2xl/tight sm:text-2xl',
  };

  const commonClasses = ' font-extrabold';

  return (
    <HeadingTag
      className={
        headingCLassesMap[HeadingTag] +
        commonClasses +
        ` hover:text-slate-600 transition`
      }
    >
      <Link href={href}>{children}</Link>
    </HeadingTag>
  );
}
