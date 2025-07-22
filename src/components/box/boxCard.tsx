import UserHeart from '@/libs/shared/icons/UserHeart';

type Props = {
  boxSlug: string;
};
const BoxCard = ({ boxSlug }: Props) => {
  return (
    <div>
      {boxSlug}
      <div className="box-card">
        <UserHeart />
      </div>
    </div>
  );
};

export default BoxCard;
