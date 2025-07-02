import apiRequest from '@/apis/apiRequest';

const userRequests = {
  async userKyc(body: { email: string }): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/kyc',
      'POST',
      body
    );
  }
};

export default userRequests;
