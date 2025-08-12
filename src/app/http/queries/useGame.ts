import { goldMiningRequest } from '@/app/http/requests/goldMining';
import { useQuery } from '@tanstack/react-query';

export const useGetRestTime = () => {
  return useQuery({
    queryKey: ['get-rest-time'],
    queryFn: async () => await goldMiningRequest.GoldMiningRestTimes()
  });
};
