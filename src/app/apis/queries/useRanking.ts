import userRequests from '@/app/apis/requests/user';
import type { UserRanking } from '@/types/user';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useChapterLists = () => {
  return useInfiniteQuery<UserRanking>({
    queryKey: ['chapter-lists'],
    queryFn: async ({ pageParam }) => {
      const res = await userRequests.userRanking(pageParam as number);
      if (!res) {
        throw new Error('Something went wrong when fetching chapters');
      }
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.users.length) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });
};
