import { ApiException } from '@/app/http/apiRequest';
import { boxRequest } from '@/app/http/requests/box';
import type { BoxTreeRes } from '@/types/box';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseBoxTreeOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
}

// Hook chính để fetch data ban đầu (sẽ được sử dụng để khởi tạo)
export const useBoxTree = (
  address: string,
  options: UseBoxTreeOptions = {}
) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = false,
  } = options;

  return useQuery<BoxTreeRes, Error>({
    queryKey: ['box-tree', address],

    queryFn: async (): Promise<BoxTreeRes> => {
      if (!address) {
        throw new Error('Address is required');
      }

      // Fetch với limit lớn nhất để có thể chia cho tất cả boxes
      const maxLimit = 9 ** 9; // 9^9 để đảm bảo có đủ data cho tất cả boxes

      const response = await boxRequest.boxTree({
        address,
        page: 1,
        limit: maxLimit
      });

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }

      // Validate response structure
      if (!response.result || !response.result.pagination) {
        throw new Error('Invalid response structure');
      }

      return response;
    },

    enabled: enabled && !!address,
    retry: (failureCount, error) => {
      // Don't retry for certain errors
      if (error instanceof ApiException) {
        return false;
      }
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },

    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

    throwOnError: (error) => {
      if (error instanceof ApiException) {
        toast.error(error.message);
        return false;
      }

      // Log unexpected errors
      console.error('Box tree query error:', error);

      // Show generic error message for unexpected errors
      toast.error('Đã xảy ra lỗi khi tải dữ liệu');
      return false;
    },

    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,

    // Network mode configuration
    networkMode: 'online',

    // Meta data for debugging
    meta: {
      errorMessage: 'Failed to fetch box tree data',
    },
  });
};

// Hook để fetch data cho một box cụ thể với limit tương ứng
export const useBoxData = (
  address: string,
  boxNumber: number,
  page: number = 1,
  options: UseBoxTreeOptions = {}
) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
    refetchOnWindowFocus = false,
    refetchOnMount = false,
  } = options;

  const limit = 9 ** boxNumber; // 9^boxNumber

  return useQuery<BoxTreeRes, Error>({
    queryKey: ['box-data', address, boxNumber, page],

    queryFn: async (): Promise<BoxTreeRes> => {
      if (!address) {
        throw new Error('Address is required');
      }

      const response = await boxRequest.boxTree({
        address,
        page: 1, // Always use page 1 since we handle offset manually
        limit
      });

      if (response instanceof Error) {
        throw response;
      }

      if (!response) {
        throw new Error('Response is null');
      }

      if (!response.result || !response.result.pagination) {
        throw new Error('Invalid response structure');
      }

      return response;
    },

    enabled: enabled && !!address && boxNumber >= 1 && boxNumber <= 9,
    retry: (failureCount, error) => {
      if (error instanceof ApiException) {
        return false;
      }
      return failureCount < 3;
    },

    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

    throwOnError: (error) => {
      if (error instanceof ApiException) {
        toast.error(error.message);
        return false;
      }

      console.error(`Box ${boxNumber} query error:`, error);
      toast.error(`Đã xảy ra lỗi khi tải dữ liệu Box ${boxNumber}`);
      return false;
    },

    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    networkMode: 'online',

    meta: {
      errorMessage: `Failed to fetch box ${boxNumber} data`,
    },
  });
};

// Utility functions cho box calculations
export const getBoxConfig = (boxNumber: number) => {
  const limit = 9 ** boxNumber; // 9^boxNumber
  const offset = boxNumber === 1 ? 0 : 9 ** (boxNumber - 1); // Tổng items của các box trước đó
  return { limit, offset };
};

export const getPageOffset = (boxNumber: number, page: number) => {
  const { offset } = getBoxConfig(boxNumber);
  return offset + (page - 1) * 9; // 9 items per page
};

export const sliceUsersForBox = (allUsers: any[], boxNumber: number, page: number = 1) => {
  const itemsPerPage = 9;

  if (boxNumber === 1) {
    // Box 1: lấy 9 items đầu tiên
    return {
      users: allUsers.slice(0, itemsPerPage),
      totalUsersForBox: Math.min(allUsers.length, itemsPerPage)
    };
  } else {
    // Box khác: tính offset và slice
    const previousBoxLimit = 9 ** (boxNumber - 1);
    const availableUsers = allUsers.slice(previousBoxLimit);
    const totalUsersForBox = availableUsers.length;

    // Users cho trang hiện tại
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const users = availableUsers.slice(startIndex, endIndex);

    return { users, totalUsersForBox };
  }
};

export const calculateBoxPagination = (boxNumber: number, totalUsersForBox: number, currentPage: number = 1) => {
  if (boxNumber === 1) {
    // Box 1 không có phân trang
    return null;
  }

  const totalPages = Math.ceil(totalUsersForBox / 9);

  return {
    page: currentPage,
    pageTotal: totalPages,
    total: totalUsersForBox,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    hasMoreThan9Items: totalUsersForBox > 9
  };
};
