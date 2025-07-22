import { numerologyRequest } from '@/app/apis/requests/numerology';
import Meaning from '@/components/numerology/Meaning';
import Numerology from '@/components/numerology/Numerology';
import type { NumerologyResponse } from '@/types/numberology';

const page = async ({ searchParams }: { searchParams: Promise<Record<'name' | 'birth' | 'meaning', string | undefined>> }) => {
  const params = await searchParams;
  if (!params.name || !params.birth) {
    return <div className="min-h-screen bg-numerology text-center flex items-center justify-center text-shadow-custom">Missing name or birth date parameters.</div>;
  }
  const name = params.name ?? '';
  const birth = params.birth ?? '';
  const meaning = params.meaning;
  const numerologyResult = await numerologyRequest.getNumerology(name, birth);

  const baseUrl = `/numerology/result?name=${encodeURIComponent(name)}&birth=${encodeURIComponent(birth)}`;

  const meaningList = numerologyResult?.meaning[meaning as keyof NumerologyResponse['meaning']] || [];

  if (meaning) {
    return (
      <Meaning baseUrl={baseUrl} meaning={meaning as keyof NumerologyResponse['meaning']} meaningList={meaningList} numerologyResult={numerologyResult} />
    );
  }
  return (
    <div className="min-h-screen bg-numerology flex flex-col items-center pt-10 relative overflow-x-hidden overflow-y-auto h-[200px]">
      <Numerology baseUrl={baseUrl} numerologyResult={numerologyResult} />
    </div>
  );
};

export default page;
