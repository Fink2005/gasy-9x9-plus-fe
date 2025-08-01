import { boxRequest } from '@/app/http/requests/box';
import { BOX_TREE_LIMIT } from '@/libs/shared/constants/globals';
import type { boxTreeBody, boxTreeRes } from '@/types/box';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useBoxTree = (address: string, initialPage = 1) => {
  return useInfiniteQuery<boxTreeRes | Error, unknown, boxTreeBody>({
    queryKey: ['box-tree'],
    queryFn: async ({ pageParam = initialPage }) => {
      const response = await boxRequest.boxTree({
        address,
        limit: BOX_TREE_LIMIT,
        page: pageParam as number,
      });
      if (response instanceof Error) {
        throw response;
      }
      return response;
    },
    enabled: !!address,
    initialPageParam: initialPage,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.result.users ? allPages.length + initialPage : undefined;
    },
  });
};
