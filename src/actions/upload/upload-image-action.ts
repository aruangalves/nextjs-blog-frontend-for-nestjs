'use server';

import { verifyLoginSession } from '@/lib/login/manage-login';
import { mkdir, writeFile } from 'fs/promises';
import { extname, resolve } from 'path';

type UploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadImageActionResult> {
  const isAuthenticated = await verifyLoginSession();

  const makeResult = ({ url = '', error = '' }) => {
    return { url, error };
  };
  const genericError = 'Dados inválidos';

  if (!isAuthenticated) {
    return makeResult({ error: 'Faça login antes de continuar.' });
  }

  if (!(formData instanceof FormData)) {
    return makeResult({ error: genericError });
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    return makeResult({ error: genericError });
  }

  const imageUploadMaxSize =
    Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 921600;
  const readableMaxSize = (imageUploadMaxSize / 1024).toFixed(2);
  if (file.size > imageUploadMaxSize) {
    return makeResult({
      error: `O tamanho da imagem excede o limite de upload (${readableMaxSize}KB). Por favor, escolha uma imagem menor.`,
    });
  }

  //Note: production validation requires a lib to really assert if the file has a valid type, checking only through mime-types is not recommended!
  if (!file.type.startsWith('image/')) {
    return makeResult({ error: 'Formato de imagem inválido' });
  }

  const imageExtension = extname(file.name);
  const uniqueImageName = `${Date.now()}${imageExtension}`;

  const imageUploadDirectory =
    String(process.env.IMAGE_UPLOAD_DIRECTORY) || 'uploads';

  const uploadFullPath = resolve(process.cwd(), 'public', imageUploadDirectory);

  await mkdir(uploadFullPath, { recursive: true });

  const fileArrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileArrayBuffer);

  const fileFullPath = resolve(uploadFullPath, uniqueImageName);

  await writeFile(fileFullPath, buffer);

  const imageServerUrl =
    String(process.env.IMAGE_SERVER_URL) || 'http://localhost:3000';

  const url = `${imageServerUrl}/${imageUploadDirectory}/${uniqueImageName}`;

  return makeResult({ url });
}
