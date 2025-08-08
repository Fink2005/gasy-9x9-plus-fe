import { ApiException } from '@/app/http/apiRequest';
import userRequests from '@/app/http/requests/user';
import type { UserRanking } from '@/types/user';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserRanking = (address: string, initialPage = 1) => {
  return useInfiniteQuery<UserRanking, Error>({
    queryKey: ['userRanking'],
    queryFn: async ({ pageParam = initialPage }): Promise<UserRanking> => {
      const response = await userRequests.userRanking(
        pageParam as number,
      );

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }
      return response;
    },
    retry: 0,
    enabled: !!address,
    initialPageParam: initialPage,
    throwOnError(error) {
      if (error instanceof ApiException) {
        toast.error(error.message);
        return false;
      }
      return false;
    },

    getNextPageParam: (lastPage: UserRanking) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.pageTotal;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
    staleTime: 30 * 60 * 1000, // 30 phút
    gcTime: 40 * 60 * 1000, // 40 phút (trước là cacheTime)
  });
};
