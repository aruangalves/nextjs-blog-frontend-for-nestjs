'use server';

import { createLoginSessionFromApi } from '@/lib/login/manage-login';
import { LoginSchema } from '@/lib/login/schema';
import { apiRequest } from '@/utils/api-request';
import { getZodErrorMessages } from '@/utils/get-zod-error-msgs';
import { verifyHoneypotInput } from '@/utils/verify-honeypot-input';
import { redirect } from 'next/navigation';
import { formatError } from 'zod';

type LoginActionState = {
  email: string;
  errors: string[];
};

export async function loginAction(
  loginState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));
  if (!allowLogin) {
    return {
      email: '',
      errors: ['Login is not allowed'],
    };
  }
  //this response delay is deliberate to mitigate bruteforce attacks
  //await asyncDelay(2000);
  const isBot = await verifyHoneypotInput(formData, 2000);
  if (isBot) {
    return {
      email: '',
      errors: ['nice'],
    };
  }

  const errorMsg = 'Dados inválidos, por favor tente novamente.';

  if (!(formData instanceof FormData)) {
    return {
      email: '',
      errors: [errorMsg],
    };
  }

  //Validar dados
  const formObj = Object.fromEntries(formData.entries());
  const formEmail = formObj?.email?.toString() || '';
  const parsedFormData = LoginSchema.safeParse(formObj);

  if (!parsedFormData.success) {
    return {
      email: formEmail,
      errors: getZodErrorMessages(formatError(parsedFormData.error)),
    };
  }

  //Fetch API NestJS
  const loginResponse = await apiRequest<{ accessToken: string }>(
    '/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedFormData.data),
    },
  );

  if (!loginResponse.success) {
    return {
      email: formEmail,
      errors: loginResponse.errors,
    };
  }

  //Received valid credentials, create cookie and redirect page
  await createLoginSessionFromApi(loginResponse.data.accessToken);
  redirect('/admin/post');

  //unreachable code
  /*
  return {
    email: '',
    errors: ['Success.'],
  };
  */
}
