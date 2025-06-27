import { montserrat } from '@/app/fonts/montserrat';
import IntroductionList from '@/components/introduction/IntroductionList';

const page = () => {
  return (
    <div className="pt-20">
      <h1 className={`${montserrat.variable} title-introduction`}>GIỚI THIỆU VÀ ĐỊNH HƯỚNG</h1>
      <IntroductionList />
    </div>
  );
};

export default page;
