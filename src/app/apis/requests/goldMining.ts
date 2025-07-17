import apiRequest from '@/app/apis/apiRequest';
import type { GoldMiningRestTimesResponse } from '@/types/game';
import type { UserScore } from '@/types/user';

export const goldMiningRequest = {
  async GoldMiningStart(): Promise<{ sessionId: string } | null> {
    return await apiRequest<{ sessionId: string } | null>('/mining/start', 'GET');
  },
  async GoldMiningResult(sessionId: string, score: number): Promise<UserScore | null> {
    return await apiRequest<UserScore | null>('/mining/submit', 'POST', { sessionId, score });
  },
  async GoldMiningMessage(number: number): Promise<{
    _id: string;
    number: number;
    content: string;
  } | null> {
    return await apiRequest<{
      _id: string;
      number: number;
      content: string;
    } | null>(`/mining/get-message/${number}`, 'GET');
  },
  async GoldMiningRestTimes(): Promise<GoldMiningRestTimesResponse | null> {
    return await apiRequest<GoldMiningRestTimesResponse | null>('/mining/rest-times', 'GET');
  }

};
