import { missionRequest } from '@/app/http/requests/mission';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetMission = () => {
  return useQuery({
    queryKey: ['get-mission'],
    queryFn: async () => await missionRequest.getTasks(),
    refetchOnWindowFocus: true,
  });
};

export const useUpdateMission = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async (query: 'shareLink' | 'joinGroup' | 'readTerms') =>
      missionRequest.updateTasks(query),
    // onSuccess: () => {
    //   window.open('https://www.facebook.com/share/19nBvnkfwo/?mibextid=LQQJ4d');

    //   queryClient.refetchQueries({ queryKey: ['get-mission'] });
    //   toast.success(
    //     'Chúc mừng bạn đã nhận được phần thưởng từ nhiệm vụ này!',
    //     { duration: 3000 }
    //   );
    // }

  });
};
