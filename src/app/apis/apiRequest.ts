import { createCookie, getCookie } from '@/app/actions/cookie';
import { redirect } from 'next/navigation';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiRequestConfig = {
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

const retryRequest = async <T>(retryEndpoint: string, retryConfig: ApiRequestConfig): Promise<T | null> => {
  try {
    const retryResponse = await fetch(`${baseURL}${retryEndpoint}`, retryConfig);

    if (!retryResponse.ok) {
      throw new Error(`Retry request failed with status ${retryResponse.status}`);
    }

    const contentType = retryResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await retryResponse.json();
    }

    return null;
  } catch (error) {
    throw new Error(`Retry request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const retryRefreshToken = async <T>(newAccessToken, endpoint: string, retryConfig: ApiRequestConfig): Promise<T | null> => {
  try {
    if (!newAccessToken) {
      throw new Error('Failed to get new access token after refresh');
    }

    // Update the retry config with the new token
    const updatedConfig: ApiRequestConfig = {
      ...retryConfig,
      headers: {
        ...retryConfig.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    };

    const result = await retryRequest<T>(endpoint, updatedConfig);
    return result;
  } catch (error) {
    throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data: unknown = null,
  headers: Record<string, string> = {},
): Promise<T | null> => {
  try {
    createCookie({
      name: '2123',
      value: '2123',
    });
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
        const refreshRes = await fetch('http://localhost:3000/api/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Cookie': `refreshToken9x9=${refreshToken}`, },
          credentials: 'include',
        });
        if (!refreshRes.ok) {
          redirect('/login');
        }
        const refreshData = await refreshRes.json();
        return await retryRefreshToken<T>(refreshData.accessToken, endpoint, config);
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
