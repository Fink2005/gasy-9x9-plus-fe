import { http } from '@/app/http/apiRequest';
import type { MissionRes } from '@/types/mission';

export const missionRequest = {
  async getTasks(): Promise<MissionRes | null> {
    return await http.get<MissionRes | null>('/task');
  },
  async updateTasks(query: 'shareLink' | 'joinGroup' | 'readTerms'): Promise<MissionRes | null> {
    return await http.get<MissionRes | null>(`/task/update?shareLink=${false}&joinGroup=${false}&readTerms=${query === 'readTerms'}`);
  }
};
