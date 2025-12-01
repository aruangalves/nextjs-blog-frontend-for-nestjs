'use client';

import { Button } from '@/components/Button';
import { InputCheckbox } from '@/components/InputCheckbox';
import { InputText } from '@/components/InputText';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useActionState, useEffect, useState } from 'react';
import { ImageUploader } from '../ImageUploader';
import { MessageSquareMore, MessageSquarePlusIcon } from 'lucide-react';
import { createPostAction } from '@/actions/post/create-post-action';
import { toast } from 'react-toastify';
import { updatePostAction } from '@/actions/post/update-post-action';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PublicPostForApiDto,
  PublicPostForApiSchema,
} from '@/lib/post/schemas';

type ManagePostFormUpdateProps = {
  mode: 'update';
  publicPost: PublicPostForApiDto;
};

type ManagePostFormCreateProps = {
  mode: 'create';
};

type ManagePostFormProps =
  | ManagePostFormUpdateProps
  | ManagePostFormCreateProps;

export function ManagePostForm(props: ManagePostFormProps) {
  const { mode } = props;
  const searchParams = useSearchParams();
  const created = searchParams.get('created');
  const router = useRouter();

  let publicPost;
  let buttonText = (
    <>
      <MessageSquarePlusIcon /> Criar post
    </>
  );
  if (mode === 'update') {
    publicPost = props.publicPost;
    buttonText = (
      <>
        <MessageSquareMore /> Editar post
      </>
    );
  }

  const actionsMap = {
    update: updatePostAction,
    create: createPostAction,
  };

  const initialState = {
    formState: PublicPostForApiSchema.parse(publicPost || {}),
    errors: [],
  };
  const [postState, formAction, isPending] = useActionState(
    actionsMap[mode],
    initialState,
  );

  useEffect(() => {
    if (postState.errors.length > 0) {
      toast.dismiss();
      postState.errors.forEach((error) => toast.error(error));
    }
  }, [postState.errors]);

  useEffect(() => {
    if (postState.success) {
      toast.dismiss();
      toast.success('Post atualizado com sucesso!');
    }
  }, [postState.success]);

  useEffect(() => {
    if (created === '1') {
      toast.dismiss();
      toast.success('Post criado com sucesso!');
      //remove ?created=1 from URL to stop new post toast from showing on screen
      const url = new URL(window.location.href);
      url.searchParams.delete('created');
      router.replace(url.toString());
    }
  }, [created, router]);

  const { formState } = postState;
  const [contentValue, setContentValue] = useState(formState.content);

  return (
    <form action={formAction} className='mb-16 flex flex-col gap-4'>
      <InputText
        labelText='ID'
        name='id'
        placeholder='ID gerado automaticamente'
        type='text'
        readOnly
        defaultValue={formState.id}
        disabled={isPending}
      />
      <InputText
        labelText='Slug'
        name='slug'
        placeholder='Slug gerado automaticamente'
        type='text'
        readOnly
        defaultValue={formState.slug}
        disabled={isPending}
      />
      <InputText
        labelText='Título'
        name='title'
        placeholder='Digite o título'
        type='text'
        defaultValue={formState.title}
        disabled={isPending}
      />
      <InputText
        labelText='Excerto'
        name='excerpt'
        placeholder='Digite o resumo'
        type='text'
        defaultValue={formState.excerpt}
        disabled={isPending}
      />
      <MarkdownEditor
        labelText='Conteúdo'
        textAreaName='content'
        value={contentValue}
        setValue={setContentValue}
        disabled={isPending}
      />
      <ImageUploader disabled={isPending} />
      <InputText
        labelText='URL da imagem de capa'
        name='coverImageUrl'
        placeholder='Digite a URL da imagem de capa'
        type='text'
        defaultValue={formState.coverImageUrl}
      />
      {mode === 'update' && (
        <InputCheckbox
          labelText='Publicar post?'
          name='published'
          type='checkbox'
          defaultChecked={formState.published}
          disabled={isPending}
        />
      )}

      <Button type='submit' disabled={isPending}>
        {buttonText}
      </Button>
    </form>
  );
}
