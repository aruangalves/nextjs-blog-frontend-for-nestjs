import { formatDate, formatRelativeDate } from '@/utils/format-date';

type PostDateProps = {
  date: string;
  className?: string;
  featured?: boolean;
};

export function PostDate({
  date,
  className = '',
  featured = false,
}: PostDateProps) {
  return (
    <time
      dateTime={date}
      title={featured ? formatDate(date) : formatRelativeDate(date)}
      className={className}
    >
      {featured ? formatRelativeDate(date) : formatDate(date)}
    </time>
  );
}
