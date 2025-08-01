import { http } from '@/app/http/apiRequest';
import { BOX_TREE_LIMIT } from '@/libs/shared/constants/globals';
import type { BoxDetailRes, BoxRes, BoxTreeBody, BoxTreeRes } from '@/types/box';

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
  async boxTree(boxTree: BoxTreeBody): Promise<BoxTreeRes | null> {
    const { address, page } = boxTree;
    return await http.get<BoxTreeRes | null>(`/box/tree?address=${address}&limit=${BOX_TREE_LIMIT}&page=${page}`);
  }
};
