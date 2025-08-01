import { http } from '@/app/http/apiRequest';
import type { NumerologyResponse } from '@/types/numberology';

export const numerologyRequest = {
  async getNumerology(name: string, birth: string): Promise<NumerologyResponse | null> {
    return await http.post<NumerologyResponse | null> (
      '/numerology/meanings',
      {
        name,
        birth
      }
    );
  }
};
