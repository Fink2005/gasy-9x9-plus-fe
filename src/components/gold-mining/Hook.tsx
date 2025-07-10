import { HookIcon } from '@/libs/shared/icons/Hook';
import type { GameItem } from '@/types/game';
import type React from 'react';
import { CarriedItem } from './CarriedItem';

interface HookProps {
  angle: number;
  ropeLength: number;
  isSwinging: boolean;
  isExtending: boolean;
  isShrinking: boolean;
  carriedItem: GameItem | null;
  hookRef: React.RefObject<HTMLDivElement>;
  hookTipMarkerRef: React.RefObject<HTMLDivElement>;
  debugMode: boolean;
}

export const Hook = ({
  angle,
  ropeLength,
  isSwinging,
  isExtending,
  isShrinking,
  carriedItem,
  hookRef,
  hookTipMarkerRef,
  debugMode,
}: HookProps) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <div
        ref={hookRef}
        className="origin-top -translate-y-[9px]"
        style={{
          transform: `rotate(${angle}deg)`,
          transition: isSwinging ? 'transform 0.05s linear' : 'none',
        }}
      >
        <HookIcon
          ropeLength={ropeLength}
          isShrinking={isShrinking}
          className={isExtending ? 'transition-none' : ''}
          style={{
            transition: isExtending ? 'none !important' : undefined,
          }}
        />

        {/* Hook Tip Marker */}
        <div
          ref={hookTipMarkerRef}
          className="absolute w-2 h-2 pointer-events-none"
          style={{
            left: '-1px',
            top: `${ropeLength + 36}px`,
            backgroundColor: debugMode ? 'rgba(255, 0, 0, 0.5)' : 'transparent',
            borderRadius: '50%',
            zIndex: 100,
          }}
        />

        {/* Display carried item */}
        {carriedItem && <CarriedItem item={carriedItem} ropeLength={ropeLength} isShrinking={isShrinking} />}
      </div>
    </div>
  );
};
