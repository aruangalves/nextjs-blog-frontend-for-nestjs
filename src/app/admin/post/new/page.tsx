import { ManagePostForm } from '@/components/Admin/ManagePostForm';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Criar post',
};

export default async function AdminPostNewPage() {
  return (
    <div className='pb-8'>
      <h1 className='text-4xl font-bold pt-4 pb-8'>Criar Post</h1>
      <ManagePostForm mode='create' />
    </div>
  );
}
