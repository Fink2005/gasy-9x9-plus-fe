import { http } from '@/app/http/apiRequest';
import type { BoxDetailRes, BoxRes, boxTreeBody, boxTreeRes } from '@/types/box';

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
  },
  async boxTree(boxTree: boxTreeBody): Promise<boxTreeRes> {
    const { address, limit, page } = boxTree;
    return await http.get<boxTreeRes>(`/box/tree?address=${address}&limit=${limit}&page=${page}`);
  }
};
