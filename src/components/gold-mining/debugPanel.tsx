/* eslint-disable react/no-array-index-key */
'use client';

import { checkRectOverlap } from '@/libs/utils/gameUtils';
import type { DebugInfo } from '@/types/game';

interface DebugPanelProps {
  debugMode: boolean;
  setDebugMode: (mode: boolean) => void;
  angle: number;
  ropeLength: number;
  isExtending: boolean;
  debugInfo: DebugInfo;
  gameContainerRef: any;
}

export const DebugPanel = ({
  debugMode,
  setDebugMode,
  angle,
  ropeLength,
  isExtending,
  debugInfo,
  gameContainerRef,
}: DebugPanelProps) => {
  if (process.env.NODE_ENV === 'production' || !debugMode) {
    return null;
  }

  return (
    <>
      {/* Debug Controls */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm">
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setDebugMode(!debugMode)}
            className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
          >
            Toggle Debug:
            {' '}
            {debugMode ? 'ON' : 'OFF'}
          </button>
        </div>
        <div>
          Angle:
          {angle.toFixed(1)}
          °
        </div>
        <div>
          Rope Length:
          {ropeLength}
          px
        </div>
        <div>
          Extending:
          {isExtending ? 'Yes' : 'No'}
        </div>
        <div>
          Collision:
          {' '}
          {debugInfo.collisionDetected
            ? `${debugInfo.collisionDetected.type} #${debugInfo.collisionDetected.id}`
            : 'None'}
        </div>
      </div>

      {/* Hook Tip Visualization */}
      {debugInfo.hookTipRect && gameContainerRef.current && (
        <div
          className="absolute border-2 border-red-500 bg-red-500 bg-opacity-25 pointer-events-none z-50"
          style={{
            left: debugInfo.hookTipRect.left - gameContainerRef.current.getBoundingClientRect().left,
            top: debugInfo.hookTipRect.top - gameContainerRef.current.getBoundingClientRect().top,
            width: debugInfo.hookTipRect.width,
            height: debugInfo.hookTipRect.height,
            borderRadius: '50%',
          }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-500 text-xs font-bold whitespace-nowrap">
            HOOK TIP
          </div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-600 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}

      {/* Item Bounding Boxes Visualization */}
      {debugInfo.itemRects.map((item, index) => {
        const containerRect = gameContainerRef.current?.getBoundingClientRect();
        if (!containerRect) {
          return null;
        }

        return (
          <div
            key={`debug-${item.id}-${index}`}
            className={`absolute border-2 pointer-events-none z-40 ${
              item.type === 'heart'
                ? 'border-yellow-400 bg-yellow-400 bg-opacity-10'
                : item.type === 'blueStar'
                  ? 'border-blue-400 bg-blue-400 bg-opacity-10'
                  : 'border-gray-400 bg-gray-400 bg-opacity-10'
            }`}
            style={{
              left: item.rect.left - containerRect.left,
              top: item.rect.top - containerRect.top,
              width: item.rect.width,
              height: item.rect.height,
            }}
          >
            <div
              className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold ${
                item.type === 'heart' ? 'text-yellow-600' : item.type === 'blueStar' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {item.type.toUpperCase()}
              {' '}
              #
              {item.id}
            </div>
          </div>
        );
      })}

      {/* Collision Detection Area Visualization */}
      {debugInfo.hookTipRect
        && debugInfo.itemRects.map((item, index) => {
          const containerRect = gameContainerRef.current?.getBoundingClientRect();
          if (!containerRect) {
            return null;
          }

          const isColliding = checkRectOverlap(debugInfo.hookTipRect!, item.rect, 15);
          if (isColliding) {
            return (
              <div
                key={`collision-${item.id}-${index}`}
                className="absolute border-4 border-green-500 bg-green-500 bg-opacity-25 pointer-events-none z-45"
                style={{
                  left: debugInfo.hookTipRect
                    ? Math.min(debugInfo.hookTipRect.left, item.rect.left) - containerRect.left - 15
                    : item.rect.left - containerRect.left - 15,
                  top: debugInfo.hookTipRect
                    ? Math.min(debugInfo.hookTipRect.top, item.rect.top) - containerRect.top - 15
                    : item.rect.top - containerRect.top - 15,
                  width:
                    (debugInfo.hookTipRect ? Math.max(debugInfo.hookTipRect.right, item.rect.right) : item.rect.right)
                    - Math.min(debugInfo.hookTipRect?.left ?? 0, item.rect.left)
                    + 30,
                  height:
                    Math.max(debugInfo.hookTipRect?.bottom ?? 0, item.rect.bottom)
                    - Math.min(debugInfo.hookTipRect?.top ?? 0, item.rect.top)
                    + 30,
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xs font-bold">
                  COLLISION!
                </div>
              </div>
            );
          }
          return null;
        })}
    </>
  );
};
