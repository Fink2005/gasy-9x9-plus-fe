import { missionRequest } from '@/app/http/requests/mission';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetMission = () => {
  return useQuery({
    queryKey: ['get-mission'],
    queryFn: async () => await missionRequest.getTasks(),
  });
};

export const useUpdateMission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (query: 'shareLink' | 'joinGroup' | 'readTerms') =>
      await missionRequest.updateTasks(query),
    onSuccess: () => {
      toast.success(
        'Chúc mừng bạn đã nhận được phần thưởng từ nhiệm vụ này!',
        {
          duration: 3000,
        }
      );
      queryClient.invalidateQueries({ queryKey: ['get-mission'] });
    },
  });
};
