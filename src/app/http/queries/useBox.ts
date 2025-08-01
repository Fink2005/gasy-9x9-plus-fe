import { boxRequest } from '@/app/http/requests/box';
import type { BoxTreeRes } from '@/types/box';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useBoxTree = (address: string, initialPage = 1) => {
  return useInfiniteQuery<BoxTreeRes, Error>({
    queryKey: ['boxTree', address],
    queryFn: async ({ pageParam = initialPage }): Promise<BoxTreeRes> => {
      const response = await boxRequest.boxTree({
        address,
        page: pageParam as number,
      });

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }

      return response;
    },
    enabled: !!address,
    initialPageParam: initialPage,

    getNextPageParam: (lastPage: BoxTreeRes) => {
      const currentPage = lastPage.result.pagination.page;
      const totalPages = lastPage.result.pagination.pageTotal;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },

    getPreviousPageParam: (firstPage: BoxTreeRes) => {
      const currentPage = firstPage.result.pagination.page;
      return currentPage > 1 ? currentPage - 1 : undefined;
    },

    // Thêm config để giữ lại pages cũ
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút (trước là cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook mới để fetch một page cụ thể
export const useBoxTreePage = (address: string, page: number, enabled = false) => {
  return useInfiniteQuery<BoxTreeRes, Error>({
    queryKey: ['boxTree', address, 'page', page],
    queryFn: async (): Promise<BoxTreeRes> => {
      const response = await boxRequest.boxTree({
        address,
        page,
      });

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }

      return response;
    },
    enabled: !!address && enabled,
    initialPageParam: page,
    getNextPageParam: () => undefined, // Không cần infinite scroll cho single page
    getPreviousPageParam: () => undefined,
  });
};
