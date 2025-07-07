import { Header } from '@/components/header-footer/Header';

const page = () => {
  // const headersList = await headers();
  // const pathName = headersList.get('x-pathname');
  // console.log(pathName);
  return (
    <div className="min-h-screen bg-home">
      <Header />
    </div>
  );
};

export default page;
