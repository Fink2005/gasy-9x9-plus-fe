import BlueStarIcon from '@/libs/shared/icons/BlueStar';
import HeartIcon from '@/libs/shared/icons/Heart';
import StarIcon from '@/libs/shared/icons/Star';
import StoneIcon from '@/libs/shared/icons/Stone';
import type { GameItem } from '@/types/game';
import Image from 'next/image';

interface CarriedItemProps {
  item: GameItem;
  ropeLength: number;
  isShrinking: boolean;
}

export const CarriedItem = ({ item, ropeLength, isShrinking }: CarriedItemProps) => {
  const renderIcon = () => {
    switch (item.type) {
      case 'heart':
        return (
          <div style={{ width: 65, height: 65 }}>
            <HeartIcon />
          </div>
        );
      case 'stone':
        return (
          <div
            style={{
              width: 65,
              height: 65,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StoneIcon />
          </div>
        );
      case 'blueStar':
        return (
          <div
            style={{
              width: 65,
              height: 65,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BlueStarIcon />
          </div>
        );
      case 'blindBox':
        return (
          <div
            style={{
              width: 65,
              height: 65,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image width={65} height={65} sizes="size-[65px]" alt="blind box" src="/assets/blind-box.png" />
          </div>
        );
      default:
        return (
          <div
            style={{
              width: 65,
              height: 65,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StarIcon />
          </div>
        );
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${-item.size / 2}px`,
        top: `${ropeLength + 36}px`,
        width: item.size,
        height: item.size,
        transition: isShrinking ? 'transform 0.05s linear' : 'none',
        zIndex: 10,
      }}
    >
      {renderIcon()}
    </div>
  );
};
