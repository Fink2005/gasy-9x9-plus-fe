import apiRequest from '@/app/apis/apiRequest';
import type { UserScore } from '@/types/user';

export const goldMiningRequest = {
  async GoldMiningStart(): Promise<{ sessionId: string } | null> {
    return await apiRequest<{ sessionId: string } | null>('/mining/start', 'GET');
  },
  async GoldMiningResult(sessionId: string, score: number): Promise<UserScore | null> {
    return await apiRequest<UserScore | null>('/mining/submit', 'POST', { sessionId, score });
  }
};
