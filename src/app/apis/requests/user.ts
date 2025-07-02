import apiRequest from '@/app/apis/apiRequest';

const userRequests = {
  async userKyc(body: { email: string }): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/kyc',
      'PATCH',
      body
    );
  },
  async verifyKyc(body: { kycOtp: string }): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/verify-kyc',
      'PATCH',
      body
    );
  },
  async resendOtp(): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/resend-otp',
      'PATCH'
    );
  }
};

export default userRequests;
