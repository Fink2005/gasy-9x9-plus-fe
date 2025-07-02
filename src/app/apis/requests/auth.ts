import apiRequest from '@/app/apis/apiRequest';
import type { loginPayload, loginResponse } from '@/types/auth';

const authRequests = {
  async login(body: loginPayload): Promise<loginResponse> {
    return await apiRequest<loginResponse>('/auth/login', 'POST', body);
  }
};

export default authRequests;
