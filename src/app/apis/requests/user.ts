import { http } from '@/app/apis/apiRequest';
import { USER_RANKING_LIMIT } from '@/libs/shared/constants/globals';
import type { VerifyKycResponse } from '@/types/auth';
import type { UserRanking } from '@/types/user';

const userRequests = {
  async userKyc(body: { email: string }): Promise<{ message: string } | null> {
    return await http.patch<{ message: string } | null>(
      '/user/kyc',
      body
    );
  },
  async verifyKyc(body: { kycOtp: string }): Promise<VerifyKycResponse | null> {
    return await http.patch<VerifyKycResponse | null>(
      '/user/verify-kyc',
      body
    );
  },
  async resendOtp(): Promise<{ message: string } | null> {
    return await http.patch<{ message: string } | null>(
      '/user/resend-otp',
      'PATCH'
    );
  },
  async userRanking(page: number): Promise<UserRanking | null> {
    return await http.get<UserRanking | null>(
      `/user/ranking?page=${page}?limit=${USER_RANKING_LIMIT}`
    );
  }
};

export default userRequests;
