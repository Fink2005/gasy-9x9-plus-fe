import apiRequest from '@/app/apis/apiRequest';
import type { LoginPayload, LoginResponse } from '@/types/auth';

const authRequests = {
  async login(body: LoginPayload): Promise<LoginResponse> {
    return await apiRequest<LoginResponse>('/auth/login', 'POST', body,);
  },
  async refreshToken(token: string): Promise<{ success: boolean } | null> {
    return await apiRequest<{ success: boolean } | null>('/auth/refresh-token', 'POST', { refreshToken: token });
  },
  async logout(): Promise<{ success: boolean } | null> {
    return await apiRequest<{ success: boolean } | null>('/auth/logout', 'POST');
  }
};

export default authRequests;
