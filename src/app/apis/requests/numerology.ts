import apiRequest from '@/app/apis/apiRequest';
import type { NumerologyResponse } from '@/types/numberology';

export const numerologyRequest = {
  async getNumerology(name: string, birth: string): Promise<NumerologyResponse | null> {
    return await apiRequest<NumerologyResponse | null> (
      '/numerology/meanings',
      'POST',
      {
        name,
        birth
      }
    );
  }
};
