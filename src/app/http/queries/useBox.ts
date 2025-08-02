import { boxRequest } from '@/app/http/requests/box';
import type { BoxTreeRes } from '@/types/box';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useBoxTree = (address: string, initialPage = 1) => {
  const boxTreeInfiniteRes = useInfiniteQuery<BoxTreeRes, Error>({ // ✅ Bỏ union type
    queryKey: ['box-tree', address],
    queryFn: async ({ pageParam = initialPage }): Promise<BoxTreeRes> => { // ✅ Explicit return type
      const response = await boxRequest.boxTree({
        address,
        page: pageParam as number,
      });

      if (response instanceof Error) {
        throw response; // ✅ Throw error instead of returning
      }

      if (!response) {
        throw new Error('Response is null');
      }
      return response;
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5,
    initialPageParam: initialPage,
    getNextPageParam: (lastPage: BoxTreeRes) => { // ✅ lastPage sẽ chỉ là BoxTreeRes
      const currentPage = lastPage.result.pagination.page;
      const totalPages = lastPage.result.pagination.pageTotal;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    }
  });

  return {
    ...boxTreeInfiniteRes,
    data: boxTreeInfiniteRes.data?.pages.flatMap(page => page.result.users) || [],
  };
};
