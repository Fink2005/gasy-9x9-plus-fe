/* eslint-disable react-hooks-extra/no-unnecessary-use-prefix */
import { getCookie } from '@/app/actions/cookie';

const useGetCookie = () => {
  const handleGetCookie = async (name: string) => {
    const data = await getCookie(name);
    if (data) {
      const dataCookieParsed = JSON.parse(data);
      return dataCookieParsed;
    }
  };
  return (
    handleGetCookie
  );
};

export default useGetCookie;
