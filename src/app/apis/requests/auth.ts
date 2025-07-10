import apiRequest from '@/app/apis/apiRequest';
import type { LoginPayload, LoginResponse } from '@/types/auth';

const authRequests = {
  async login(body: LoginPayload): Promise<LoginResponse> {
    return await apiRequest<LoginResponse>('/auth/login', 'POST', body,);
  }
};

export default authRequests;
