import Link from 'next/link';
import Image from 'next/image';

type PostCoverImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  linkProps: React.ComponentProps<typeof Link>;
};

export function PostCoverImage({ imageProps, linkProps }: PostCoverImageProps) {
  return (
    <Link
      className={`w-full h-full overflow-hidden rounded-xl ${linkProps.className}`}
      {...linkProps}
    >
      <Image
        {...imageProps}
        className={`group-hover:scale-105 transition w-full h-full object-cover object-center ${imageProps.className}`}
        alt={imageProps.alt}
      ></Image>
    </Link>
  );
}
