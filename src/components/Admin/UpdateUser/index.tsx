import ErrorMessage from '@/components/ErrorMessage';
import { UpdateUserForm } from '../UpdateUserForm';
import { getUserFromApi } from '@/lib/user/api/get-user';

export async function UpdateUser() {
  const user = await getUserFromApi();

  if (!user) {
    return (
      <ErrorMessage
        contentTitle='Acesso negado'
        message='Você precisa fazer login novamente.'
      />
    );
  }

  return <UpdateUserForm user={user} />;
}
