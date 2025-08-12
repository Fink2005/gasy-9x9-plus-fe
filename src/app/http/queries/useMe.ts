import { handleRevalidateTag } from '@/app/actions/revalidation';
import userRequest from '@/app/http/requests/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['get-me'],
    queryFn: async () => await userRequest.userGetMe(),
    retry: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateMe = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (name: string) => await userRequest.userUpdateMe(name),
    onError: () => {
      toast.error('Cập nhật thông tin không thành công!');
    },
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!');
      handleRevalidateTag('get-me');
      router.refresh();
    },
  });
};
