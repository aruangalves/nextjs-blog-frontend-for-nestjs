import { MenuAdmin } from '@/components/Admin/MenuAdmin';
import { requireLoginSessionOrRedirectFromApi } from '@/lib/login/manage-login';

type AdminPostLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPostLayout({
  children,
}: Readonly<AdminPostLayoutProps>) {
  await requireLoginSessionOrRedirectFromApi();

  return (
    <>
      <MenuAdmin />
      {children}
    </>
  );
}
