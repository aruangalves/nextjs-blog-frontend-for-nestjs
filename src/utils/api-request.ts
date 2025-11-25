type ApiRequestError = {
  errors: string[];
  success: false;
  status: number;
};

type ApiRequestSuccess<T> = {
  data: T;
  success: true;
  status: number;
};

export type ApiRequest<T> = ApiRequestError | ApiRequestSuccess<T>;

export const apiUrl = process.env.API_URL || 'http://localhost:3001';

export async function apiRequest<T>(
  routePath: string,
  options?: RequestInit,
): Promise<ApiRequest<T>> {
  try {
    const url = `${apiUrl}${routePath}`;
    const response = await fetch(url, options);
    const jsonResponse = await response.json().catch(() => null);

    if (!response.ok) {
      const errors = Array.isArray(jsonResponse?.message)
        ? jsonResponse.message
        : [jsonResponse?.message || 'Erro inesperado.'];

      return {
        errors,
        success: false,
        status: response.status,
      };
    }

    return {
      success: true,
      data: jsonResponse,
      status: response.status,
    };
  } catch (err) {
    console.log(err);

    return {
      errors: ['Erro de conexão com o servidor.'],
      success: false,
      status: 500,
    };
  }
}
