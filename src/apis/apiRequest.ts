/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable no-throw-literal */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestConfig {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

interface ApiError extends Error {
  message: string;
}

export async function getAuthToken(context?: any): Promise<string | null> {
  const isServer = typeof window === 'undefined';
  let accessToken = '';

  if (isServer && context?.req) {
    // Server-side: read authData cookie from req.cookies
    const authData = context.req.cookies.authData;
    accessToken = authData ? JSON.parse(authData).accessToken : '';
  } else if (!isServer) {
    // Client-side: read authData cookie from document.cookie
    const authData = document.cookie.replace(/(?:^|.*;\s*)authData\s*=\s*([^;]*).*$|^.*$/, '$1') || '';
    accessToken = authData ? JSON.parse(authData).accessToken : '';
  } else {
    console.warn('No request object provided for server-side cookie reading');
    return null;
  }

  if (!accessToken) {
    return null;
  }

  return accessToken;
}
const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data: unknown = null,
  headers: Record<string, string> = {},
): Promise<T | null> => {
  try {
    const config: ApiRequestConfig = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`https://backend-9x9.onrender.com/api${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`) as ApiError;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }
    return null;
  } catch (error) {
    console.error(`API request failed: ${(error as ApiError).message}`);
    throw error;
  }
};

export default apiRequest;
