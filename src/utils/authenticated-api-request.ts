import 'server-only';

import { getLoginSessionFromApi } from '@/lib/login/manage-login';
import { ApiRequest, apiRequest } from './api-request';

export async function authenticatedApiRequest<T>(
  routePath: string,
  options?: RequestInit,
): Promise<ApiRequest<T>> {
  const jwtToken = await getLoginSessionFromApi();

  if (!jwtToken) {
    return {
      success: false,
      errors: ['Usuário não autenticado.'],
      status: 401,
    };
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${jwtToken}`,
  };

  return apiRequest<T>(routePath, { ...options, headers });
}
