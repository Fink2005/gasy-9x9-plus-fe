'use client';

import { createCookie } from '@/app/actions/cookie';
import { DebugPanel } from '@/components/gold-mining/debugPanel';
import useTimeInterval from '@/hooks/useTimeInterval';
import BlueStarIcon from '@/libs/shared/icons/BlueStar';
import ClockIcon from '@/libs/shared/icons/Clock';
import HeartIcon from '@/libs/shared/icons/Heart';
import { HookIcon } from '@/libs/shared/icons/Hook';
import HookBaseIcon from '@/libs/shared/icons/HookBase';
import SpeakerIcon from '@/libs/shared/icons/Speaker';
import StarIcon from '@/libs/shared/icons/Star';
import StoneIcon from '@/libs/shared/icons/Stone';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface GameItem {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'heart' | 'blueStar' | 'star' | 'stone' | 'blindBox';
}

const SpaceshipGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);
  const hookTipMarkerRef = useRef<HTMLDivElement>(null); // New ref for hook tip marker
  const heartItemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const blueStarRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const stoneRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const blindBoxRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const starRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [angle, setAngle] = useState(-90);
  const [isSwinging, setIsSwinging] = useState(true);
  const [isExtending, setIsExtending] = useState(false);
  const [ropeLength, setRopeLength] = useState(20);
  const [isShrinking, setIsShrinking] = useState(false);

  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV !== 'production'); // Set to true for debugging
  const [debugInfo, setDebugInfo] = useState<{
    hookTipRect: DOMRect | null;
    collisionDetected: GameItem | null;
    itemRects: Array<{ id: number; rect: DOMRect; type: string }>;
  }>({
    hookTipRect: null,
    collisionDetected: null,
    itemRects: [],
  });

  // Helper function to generate random positions
  const generateRandomItems = (count: number, type: 'heart' | 'blueStar' | 'stone' | 'blindBox' | 'star') => {
    const items: GameItem[] = [];
    const minDistance = 100;
    const bounds = {
      minX: -250,
      maxX: 150,
      minY: 300,
      maxY: 800,
    };

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let validPosition = false;
      let newItem: GameItem;

      while (!validPosition && attempts < 50) {
        const x = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
        const y = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;
        const size = type === 'heart' ? Math.random() * 15 + 15 : type === 'stone' ? Math.random() * 20 + 30 : type === 'blueStar' ? Math.random() * 15 + 15 : type === 'blindBox' ? 65 : Math.random() * 15 + 15;

        newItem = {
          id: Date.now() + Math.random() + i,
          x: Math.round(x),
          y: Math.round(y),
          size: Math.round(size),
          type,
        };

        const distanceFromCenter = Math.sqrt(newItem.x ** 2 + newItem.y ** 2);
        const tooCloseToCenter = distanceFromCenter < 100;

        validPosition
          = !tooCloseToCenter
            && items.every((existingItem) => {
              const distance = Math.sqrt((existingItem.x - newItem.x) ** 2 + (existingItem.y - newItem.y) ** 2);
              return distance >= minDistance;
            });

        attempts++;
      }

      if (validPosition) {
        items.push(newItem!);
      }
    }

    return items;
  };

  const [heartItems, setheartItems] = useState<GameItem[]>(() => generateRandomItems(5, 'heart'));
  const [blueStars, setBlueStars] = useState<GameItem[]>(() => generateRandomItems(3, 'blueStar'));
  const [stars, setStars] = useState<GameItem[]>(() => generateRandomItems(3, 'star'));
  const [stones, setStones] = useState<GameItem[]>(() => generateRandomItems(3, 'stone'));
  const [blindBox, setBlindBox] = useState<GameItem[]>(() => generateRandomItems(3, 'blindBox'));
  const [carriedItem, setCarriedItem] = useState<GameItem | null>(null);
  const [score, setScore] = useState<{
    original: number;
    newScore: number;
  }>({
    original: 0,
    newScore: 0,
  });

  const { handleTimeInterval, isCounting, timeLeft } = useTimeInterval();

  const [isUpScrore, setIsUpScrore] = useState<boolean>(false);

  // Helper function to check if two rectangles overlap
  const checkRectOverlap = (rect1: DOMRect, rect2: DOMRect, tolerance = 0) => {
    return !(
      rect1.right < rect2.left - tolerance
      || rect1.left > rect2.right + tolerance
      || rect1.bottom < rect2.top - tolerance
      || rect1.top > rect2.bottom + tolerance
    );
  };

  // Get hook tip position using the marker element
  const getHookTipPosition = useCallback(() => {
    if (!hookTipMarkerRef.current || !gameContainerRef.current) {
      return null;
    }

    // Get the position of the hook tip marker element
    const markerRect = hookTipMarkerRef.current.getBoundingClientRect();

    // The marker is positioned exactly at the hook tip
    const hookTipX = markerRect.left + markerRect.width / 2;
    const hookTipY = markerRect.top + markerRect.height / 2;

    // Create a small rectangle representing the hook tip
    const tipRect = new DOMRect(hookTipX - 15, hookTipY - 15, 30, 30);

    return tipRect;
  }, [angle, ropeLength]);

  // Check collision using getBoundingClientRect
  const checkCollisionWithBoundingRect = useCallback(() => {
    const hookTipRect = getHookTipPosition();
    if (!hookTipRect) {
      return null;
    }

    const itemRects: Array<{ id: number; rect: DOMRect; type: string }> = [];
    let collisionDetected: GameItem | null = null;

    // Check heart items
    for (const [id, element] of heartItemRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        itemRects.push({ id, rect: itemRect, type: 'heart' });

        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);

        if (isColliding) {
          const item = heartItems.find(g => g.id === id);
          if (item) {
            collisionDetected = item;

            return item;
          }
        }
      }
    }

    // Check blue stars
    for (const [id, element] of blueStarRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        itemRects.push({ id, rect: itemRect, type: 'blueStar' });

        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);

        if (isColliding) {
          const item = blueStars.find(s => s.id === id);
          if (item) {
            collisionDetected = item;
            return item;
          }
        }
      }
    }
    // check star
    for (const [id, element] of starRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        itemRects.push({ id, rect: itemRect, type: 'blueStar' });

        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);

        if (isColliding) {
          const item = stars.find(s => s.id === id);
          if (item) {
            collisionDetected = item;

            return item;
          }
        }
      }
    }

    // Check stones
    for (const [id, element] of stoneRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        itemRects.push({ id, rect: itemRect, type: 'stone' });

        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);

        if (isColliding) {
          const item = stones.find(s => s.id === id);
          if (item) {
            collisionDetected = item;

            return item;
          }
        }
      }
    }
    // Check blind boxes
    for (const [id, element] of blindBoxRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        itemRects.push({ id, rect: itemRect, type: 'stone' });

        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);

        if (isColliding) {
          const item = blindBox.find(s => s.id === id);
          if (item) {
            collisionDetected = item;

            return item;
          }
        }
      }
    }

    // Update debug info
    if (debugMode) {
      setDebugInfo({
        hookTipRect,
        collisionDetected,
        itemRects,
      });
    }

    return null;
  }, [heartItems, blueStars, stars, stones, blindBox, getHookTipPosition, debugMode]);

  // Swinging logic
  useEffect(() => {
    if (!isSwinging) {
      return;
    }

    let direction = 1;
    const interval = setInterval(() => {
      setAngle((prev) => {
        const next = prev + direction * 2;
        if (next > 90 || next < -90) {
          direction *= -1;
        }
        return prev + direction * 2;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isSwinging]);

  // Real-time hook tip position tracking for debug
  useEffect(() => {
    if (!debugMode) {
      return;
    }

    const interval = setInterval(() => {
      const hookTipRect = getHookTipPosition();
      if (hookTipRect) {
        setDebugInfo(prev => ({
          ...prev,
          hookTipRect,
        }));
      }
    }, 16); // 60fps update rate

    return () => clearInterval(interval);
  }, [debugMode, getHookTipPosition]);

  const handleClick = useCallback(() => {
    if (isExtending) {
      return;
    }

    setIsSwinging(false);
    setIsExtending(true);
    setIsShrinking(false);

    const maxLength = 600;
    let extendLength = 20;
    let currentCarriedItem: GameItem | null = null;

    const extendInterval = setInterval(() => {
      extendLength += 2; // Tăng tốc độ lên 10
      setRopeLength(extendLength);

      // Check for collision using getBoundingClientRect
      const hitItem = checkCollisionWithBoundingRect();

      // Stop extending when hitting item or reaching max length
      if (hitItem || extendLength >= maxLength) {
        clearInterval(extendInterval);

        if (hitItem) {
          currentCarriedItem = hitItem;
          setCarriedItem(hitItem);

          // Remove item from game field immediately when caught
          if (hitItem.type === 'heart') {
            setheartItems(prev => prev.filter(g => g.id !== hitItem.id));
            heartItemRefs.current.delete(hitItem.id);
          } else if (hitItem.type === 'blueStar') {
            setBlueStars(prev => prev.filter(s => s.id !== hitItem.id));
            blueStarRefs.current.delete(hitItem.id);
          } else if (hitItem.type === 'stone') {
            setStones(prev => prev.filter(s => s.id !== hitItem.id));
            stoneRefs.current.delete(hitItem.id);
          } else if (hitItem.type === 'blindBox') {
            setBlindBox(prev => prev.filter(s => s.id !== hitItem.id));
            stoneRefs.current.delete(hitItem.id);
          } else if (hitItem.type === 'star') {
            setStars(prev => prev.filter(s => s.id !== hitItem.id));
            starRefs.current.delete(hitItem.id);
          }
        }

        // Start retracting
        setIsShrinking(true);
        let retract = extendLength;

        const retractInterval = setInterval(
          () => {
            retract -= 8;
            setRopeLength(retract);

            if (retract <= 20) {
              clearInterval(retractInterval);
              setIsExtending(false);
              setIsShrinking(false);
              setIsSwinging(true);

              // Add score when item reaches the top
              if (currentCarriedItem) {
                if (currentCarriedItem.type === 'heart') {
                  setScore(prev => ({
                    original: prev.original + 10,
                    newScore: 10
                  }));
                } else if (currentCarriedItem.type === 'blueStar') {
                  setScore(prev => ({
                    original: prev.original + 40,
                    newScore: 40
                  }));
                } else if (currentCarriedItem.type === 'stone') {
                  setScore(prev => ({
                    original: prev.original - 10,
                    newScore: -10,
                  }));
                } else if (currentCarriedItem.type === 'blindBox') {
                  setScore(prev => ({
                    original: prev.original + 100,
                    newScore: 100,
                  }));
                } else if (currentCarriedItem.type === 'star') {
                  setScore(prev => ({
                    original: prev.original + 50,
                    newScore: 50,
                  }));
                }
                setCarriedItem(null);
                setIsUpScrore(true);
              }
            }
          },
          currentCarriedItem ? 40 : 8,
        );
      }
    }, 4); // Giảm interval xuống 4ms
  }, [isExtending, checkCollisionWithBoundingRect]);

  useEffect(() => {
    if (isUpScrore) {
      setTimeout(() => {
        setIsUpScrore(false);
      }, 800);
    }
  }, [isUpScrore]);

  useEffect(() => {
    handleTimeInterval(99, true, '/gold-mining/result');
  }, []);

  useEffect(() => {
    if (score) {
      createCookie(
        {
          name: 'goldMiningScore',
          value: JSON.stringify(score.original),
        },
      );
    }
  }, [score]);

  // Ref callback for heart items
  const setheartItemRef = useCallback(
    (id: number) => (element: HTMLDivElement | null) => {
      if (element) {
        heartItemRefs.current.set(id, element);
      } else {
        heartItemRefs.current.delete(id);
      }
    },
    [],
  );

  // Ref callback for blue stars
  const setBlueStarRef = useCallback(
    (id: number) => (element: HTMLDivElement | null) => {
      if (element) {
        blueStarRefs.current.set(id, element);
      } else {
        blueStarRefs.current.delete(id);
      }
    },
    [],
  );
  //  Ref callback for stars
  const setStarRef = useCallback(
    (id: number) => (element: HTMLDivElement | null) => {
      if (element) {
        starRefs.current.set(id, element);
      } else {
        starRefs.current.delete(id);
      }
    },
    [],
  );

  // Ref callback for stones
  const setStoneRef = useCallback(
    (id: number) => (element: HTMLDivElement | null) => {
      if (element) {
        stoneRefs.current.set(id, element);
      } else {
        stoneRefs.current.delete(id);
      }
    },
    [],
  );
  const setBlindBoxRef = useCallback(
    (id: number) => (element: HTMLDivElement | null) => {
      if (element) {
        blindBoxRefs.current.set(id, element);
      } else {
        blindBoxRefs.current.delete(id);
      }
    },
    [],
  );

  return (
    <div
      ref={gameContainerRef}
      className="flex flex-col items-center min-h-screen bg-gold-mining-game pt-10 relative"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Speaker  */}
      <div className="absolute top-14 left-5">
        <SpeakerIcon />
      </div>

      {/* clock */}
      <div className="clock-card w-[120px] h-[40px] absolute right-0 flex items-center">
        <ClockIcon className="translate-y-1" />
        <p className="text-shadow-custom text-[1rem] font-[590]">{isCounting && timeLeft}</p>
      </div>
      {/* Score */}
      <div className="clock-card w-[120px] h-[40px] absolute right-0 top-22 flex items-center space-x-3">
        <Image className="w-[1.5rem] h-[1.75rem] ms-3" src="/assets/badge-medal.png" width={100} height={100} alt="badge medal" />
        <p className="text-shadow-custom text-[1rem] font-[590]">
          {' '}
          {score.original}
        </p>
      </div>

      {/* Score 2 */}

      <p className={`${isUpScrore ? '-translate-y-10 opacity-100' : ''} text-shadow-custom transition-all duration-300 opacity-0 absolute top-56 -translate-x-10`}>
        {score.newScore === -10 ? '' : '+'}
        {' '}
        {score.newScore}
      </p>

      {/* Robot + Hook */}
      <div className="absolute top-20">
        <Image
          src="/assets/mining-robot.png"
          width={107}
          height={96}
          alt="robot mining"
          className="w-[6.6875rem] h-[6rem]"
        />
        <div className="absolute left-1/2 -translate-x-1/2 top-20">
          <HookBaseIcon />
        </div>
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

            {/* Hook Tip Marker - Invisible element positioned exactly at hook tip */}
            <div
              ref={hookTipMarkerRef}
              className="absolute w-2 h-2 pointer-events-none"
              style={{
                left: '-1px', // Center the 2px marker
                top: `${ropeLength + 36}px`, // Position at hook tip
                backgroundColor: debugMode ? 'rgba(255, 0, 0, 0.5)' : 'transparent', // Visible in debug mode
                borderRadius: '50%',
                zIndex: 100,
              }}
            />

            {/* Display carried item */}
            {carriedItem && (
              <div
                className="absolute"
                style={{
                  left: `${-carriedItem.size / 2}px`,
                  top: `${ropeLength + 36}px`, // Match với hook tip position
                  width: carriedItem.size,
                  height: carriedItem.size,
                  transition: isShrinking ? 'transform 0.05s linear' : 'none',
                  zIndex: 10,
                }}
              >
                {carriedItem.type === 'heart' ? (
                  <div
                    style={{
                      width: 65,
                      height: 65,
                    }}
                  >
                    <HeartIcon />
                  </div>
                ) : carriedItem.type === 'stone' ? (
                  <div
                    style={{
                      width: 65,
                      height: 65,
                    }}
                  >
                    <StoneIcon />
                  </div>
                ) : carriedItem.type === 'blueStar' ? (
                  <div
                    style={{
                      width: 65,
                      height: 65,
                    }}
                  >
                    <BlueStarIcon />
                  </div>
                ) : carriedItem.type === 'blindBox' ? (
                  <div
                    style={{
                      width: 65,
                      height: 65,
                    }}
                  >
                    <Image width={65} height={65} sizes="size-[65px]" alt="blind box" src="/assets/blind-box.png" />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 65,
                      height: 65,
                    }}
                  >
                    <StarIcon />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <>
        {/* heart Items */}
        {heartItems.map(item => (
          <div
            key={item.id}
            ref={setheartItemRef(item.id)}
            className="absolute shadow-lg"
            style={{
              width: 65,
              height: 65,
              left: `calc(50% + ${item.x}px)`,
              top: `${item.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <HeartIcon />
          </div>
        ))}

        {/* Blue Stars */}
        {blueStars.map(star => (
          <div
            key={star.id}
            ref={setBlueStarRef(star.id)}
            className="absolute"
            style={{
              width: 65,
              height: 65,
              left: `calc(50% + ${star.x}px)`,
              top: `${star.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <BlueStarIcon />
          </div>
        ))}

        {/* Stones */}
        {stones.map(stone => (
          <div
            key={stone.id}
            ref={setStoneRef(stone.id)}
            className="absolute"
            style={{
              width: stone.size,
              height: stone.size,
              left: `calc(50% + ${stone.x}px)`,
              top: `${stone.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <StoneIcon />
          </div>
        ))}

        {/* Blind box */}

        { blindBox.map(box => (
          <div
            key={box.id}
            ref={setBlindBoxRef(box.id)}
            className="size-[65px] absolute"
            style={{
              left: `calc(50% + ${box.x}px)`,
              top: `${box.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Image
              src="/assets/blind-box.png"
              width={65}
              height={65}
              alt="blind box"
            />
          </div>
        ))}
        {/* Star */}
        {stars.map(star => (
          <div
            key={star.id}
            ref={setStarRef(star.id)}
            className="absolute size-[65px]"
            style={{
              left: `calc(50% + ${star.x}px)`,
              top: `${star.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <StarIcon />
          </div>
        ))}

        {/* Debug Visualization */}
        {process.env.NODE_ENV !== 'production' && debugMode && (
          <>
            <DebugPanel angle={angle} debugInfo={debugInfo} debugMode={debugMode} gameContainerRef={gameContainerRef} isExtending={isExtending} ropeLength={ropeLength} setDebugMode={setDebugMode} />
          </>
        )}
      </>
    </div>
  );
};

export default SpaceshipGame;
