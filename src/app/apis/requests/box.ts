import { http } from '@/app/apis/apiRequest';
import type { BoxDetailRes, BoxRes } from '@/types/box';

export const boxRequest = {
  async boxApprove(txHash: string, boxNumber: number): Promise<BoxRes | null> {
    return await http.post<BoxRes | null>('/box/approve', {
      txHash,
      boxNumber
    });
  },
  async boxOpen(txHash: string): Promise<BoxRes | null> {
    return await http.post<BoxRes | null>('/box/open', {
      txHash
    });
  },
  async boxDetail(boxNumber: number): Promise<BoxDetailRes | null> {
    return await http.get<BoxDetailRes | null>(`/box/${boxNumber}`);
  }
};
