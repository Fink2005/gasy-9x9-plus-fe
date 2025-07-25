import { getCookie } from '@/app/actions/cookie';
import { redirect } from 'next/navigation';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestConfig = {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
  credentials?: RequestCredentials;
};

export class ApiException extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
  }
}

const baseURL = typeof window === 'undefined'
  ? process.env.API_BASE_SERVER // server-side
  : process.env.NEXT_PUBLIC_API_BASE_CLIENT; // client-side


const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data: unknown = null,
  headers: Record<string, string> = {},
): Promise<T | null> => {
  try {
    const accessToken = await getCookie('accessToken9x9');

    const config: ApiRequestConfig = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...headers,
      },
      credentials: 'include',
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${baseURL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        const refreshToken = await getCookie('refreshToken9x9');
        if (!refreshToken) {
          redirect('/login');
        }
      } else if (response.status === 400 || response.status === 403) {
        try {
          const errorBody = await response.json();
          const message = errorBody.message || `Error ${response.status}`;
          throw new ApiException(message, response.status);
        } catch (error) {
          if (error instanceof ApiException) {
            throw error; // Re-throw known ApiException
          }
          throw new ApiException(`Error ${response.status}`, response.status);
        }
      } else {
        throw new ApiException(`Request failed with status ${response.status}`, response.status);
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    // Handle non-JSON responses
    return null;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default apiRequest;
