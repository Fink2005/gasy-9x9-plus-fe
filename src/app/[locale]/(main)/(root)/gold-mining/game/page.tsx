/* eslint-disable ts/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { createCookie } from '@/app/actions/cookie';
import GameItems from '@/components/gold-mining/GameItems';
import RandomBlindBox from '@/components/gold-mining/RandomBlindBox';
import RobotHook from '@/components/gold-mining/RobotHook';
import useTimeInterval from '@/hooks/useTimeInterval';
import ClockIcon from '@/libs/shared/icons/Clock';
import SpeakerIcon from '@/libs/shared/icons/Speaker';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type GameItem = {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'heart' | 'blueStar' | 'star' | 'stone' | 'blindBox';
  randomBlindBoxNumber?: number; // Only for blind boxes
};

type ViewportBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  containerWidth: number;
  containerHeight: number;
};

const SpaceshipGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);
  const hookTipMarkerRef = useRef<HTMLDivElement>(null);
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
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds>({
    minX: -250,
    maxX: 180,
    minY: 300,
    maxY: 800,
    containerWidth: 400,
    containerHeight: 600,
  });

  // Calculate responsive viewport bounds
  const calculateViewportBounds = useCallback((): ViewportBounds => {
    if (!gameContainerRef.current) {
      return {
        minX: -250,
        maxX: 150,
        minY: 300,
        maxY: 800,
        containerWidth: 400,
        containerHeight: 600,
      };
    }

    const container = gameContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calculate safe margins (considering item sizes)
    const maxItemSize = 65; // Maximum item size
    const horizontalMargin = maxItemSize;
    const verticalMargin = maxItemSize;

    // Robot position is roughly at the center top
    const robotAreaHeight = 200; // Space occupied by robot and UI elements

    // Calculate bounds relative to container center
    const availableWidth = containerWidth - horizontalMargin * 2;

    return {
      minX: -(availableWidth / 2),
      maxX: availableWidth / 2,
      minY: robotAreaHeight + verticalMargin,
      maxY: containerHeight - verticalMargin,
      containerWidth,
      containerHeight,
    };
  }, []);

  // Update viewport bounds on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      const newBounds = calculateViewportBounds();
      setViewportBounds(newBounds);
    };

    // Initial calculation
    updateBounds();

    // Add resize listener
    const handleResize = () => {
      updateBounds();
      // Regenerate items with new bounds
      regenerateAllItems();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateViewportBounds]);

  // Helper function to generate random items with responsive bounds
  const generateRandomItems = useCallback(
    (count: number, type: 'heart' | 'blueStar' | 'stone' | 'blindBox' | 'star', bounds: ViewportBounds) => {
      const items: GameItem[] = [];
      const getRandomDistance = () => {
        // Random distance between 40px and 120px
        const minDist = Math.min(70, bounds.containerWidth * 0.08);
        const maxDist = Math.min(160, bounds.containerWidth * 0.25);
        return Math.random() * (maxDist - minDist) + minDist;
      };

      for (let i = 0; i < count; i++) {
        let attempts = 0;
        let validPosition = false;
        let newItem: GameItem;

        while (!validPosition && attempts < 100) {
          const size
            = type === 'heart'
              ? Math.random() * 15 + 15
              : type === 'stone'
                ? Math.random() * 20 + 30
                : type === 'blueStar'
                  ? Math.random() * 15 + 15
                  : type === 'blindBox'
                    ? 65
                    : Math.random() * 15 + 15;

          // Ensure items don't go outside bounds considering their size
          const halfSize = size / 2;
          const safeMinX = bounds.minX + halfSize;
          const safeMaxX = bounds.maxX - halfSize;
          const safeMinY = bounds.minY + halfSize;
          const safeMaxY = bounds.maxY - halfSize;

          const x = Math.random() * (safeMaxX - safeMinX) + safeMinX;
          const y = Math.random() * (safeMaxY - safeMinY) + safeMinY;

          const randomBlindBoxNumber = type === 'blindBox' ? Math.floor(Math.random() * 9) + 1 : undefined;
          newItem = {
            id: Date.now() + Math.random() + i,
            x: Math.round(x),
            y: Math.round(y),
            size: Math.round(size),
            type,
            randomBlindBoxNumber
          };

          // Check distance from center (robot area)
          const distanceFromCenter = Math.sqrt(newItem.x ** 2 + (newItem.y - 150) ** 2);
          const tooCloseToCenter = distanceFromCenter < Math.min(120, bounds.containerWidth * 0.2);

          // Check distance from other items with random minimum distances
          const tooCloseToOthers = items.some((existingItem) => {
            const distance = Math.sqrt((existingItem.x - newItem.x) ** 2 + (existingItem.y - newItem.y) ** 2);
            const randomMinDistance = getRandomDistance();
            return distance < randomMinDistance;
          });

          validPosition = !tooCloseToCenter && !tooCloseToOthers;
          attempts++;
        }

        if (validPosition) {
          items.push(newItem!);
        }
      }

      return items;
    },
    [],
  );

  // Initialize items with default empty arrays
  const [heartItems, setHeartItems] = useState<GameItem[]>([]);
  const [blueStars, setBlueStars] = useState<GameItem[]>([]);
  const [stars, setStars] = useState<GameItem[]>([]);
  const [stones, setStones] = useState<GameItem[]>([]);
  const [blindBox, setBlindBox] = useState<GameItem[]>([]);
  // Regenerate all items when bounds change

  const randomBlindBoxSize = Math.floor(Math.random() * 3) + 1;

  const regenerateAllItems = useCallback(() => {
    const bounds = calculateViewportBounds();
    setHeartItems(generateRandomItems(5, 'heart', bounds));
    setBlueStars(generateRandomItems(3, 'blueStar', bounds));
    setStars(generateRandomItems(3, 'star', bounds));
    setStones(generateRandomItems(3, 'stone', bounds));
    setBlindBox(generateRandomItems(randomBlindBoxSize, 'blindBox', bounds));
  }, [generateRandomItems, calculateViewportBounds]);

  const [displayRandomBlindBox, setDisplayRandomBlindBox] = useState<{
    isDisplay: boolean;
    secretNumber: number;
  }>({
    isDisplay: false,
    secretNumber: 0,
  });

  // Initialize items when component mounts and bounds are available
  useEffect(() => {
    if (gameContainerRef.current && viewportBounds.containerWidth > 0) {
      regenerateAllItems();
    }
  }, [regenerateAllItems, viewportBounds.containerWidth]);

  const [carriedItem, setCarriedItem] = useState<GameItem | null>(null);
  const [score, setScore] = useState<{
    original: number;
    newScore: number;
  }>({
    original: 0,
    newScore: 0,
  });

  const { handleTimeInterval, isCounting, timeLeft } = useTimeInterval();
  const [isUpScore, setIsUpScore] = useState<boolean>(false);

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

    const markerRect = hookTipMarkerRef.current.getBoundingClientRect();
    const hookTipX = markerRect.left + markerRect.width / 2;
    const hookTipY = markerRect.top + markerRect.height / 2;
    const tipRect = new DOMRect(hookTipX - 15, hookTipY - 15, 30, 30);
    return tipRect;
  }, [angle, ropeLength]);

  // Check collision using getBoundingClientRect
  const checkCollisionWithBoundingRect = useCallback(() => {
    const hookTipRect = getHookTipPosition();
    if (!hookTipRect) {
      return null;
    }

    // Check heart items
    for (const [id, element] of heartItemRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);
        if (isColliding) {
          const item = heartItems.find(g => g.id === id);
          if (item) {
            return item;
          }
        }
      }
    }

    // Check blue stars
    for (const [id, element] of blueStarRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);
        if (isColliding) {
          const item = blueStars.find(s => s.id === id);
          if (item) {
            return item;
          }
        }
      }
    }

    // Check stars
    for (const [id, element] of starRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);
        if (isColliding) {
          const item = stars.find(s => s.id === id);
          if (item) {
            return item;
          }
        }
      }
    }

    // Check stones
    for (const [id, element] of stoneRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);
        if (isColliding) {
          const item = stones.find(s => s.id === id);
          if (item) {
            return item;
          }
        }
      }
    }

    // Check blind boxes
    for (const [id, element] of blindBoxRefs.current.entries()) {
      if (element) {
        const itemRect = element.getBoundingClientRect();
        const isColliding = checkRectOverlap(hookTipRect, itemRect, 15);
        if (isColliding) {
          const item = blindBox.find(s => s.id === id);
          if (item) {
            return item;
          }
        }
      }
    }

    return null;
  }, [heartItems, blueStars, stars, stones, blindBox, getHookTipPosition]);

  const handleClick = useCallback(() => {
    if (isExtending) {
      return;
    }
    setIsSwinging(false);
    setIsExtending(true);
    setIsShrinking(false);
    const maxLength = Math.min(600, viewportBounds.containerHeight * 0.8);
    let extendLength = 20;
    let currentCarriedItem: GameItem | null = null;

    const extendInterval = setInterval(() => {
      extendLength += 2;
      setRopeLength(extendLength);

      const hitItem = checkCollisionWithBoundingRect();

      if (hitItem || extendLength >= maxLength) {
        clearInterval(extendInterval);

        if (hitItem) {
          currentCarriedItem = hitItem;
          setCarriedItem(hitItem);
          // Remove item from game field immediately when caught
          if (hitItem.type === 'heart') {
            setHeartItems(prev => prev.filter(g => g.id !== hitItem.id));
            heartItemRefs.current.delete(hitItem.id);
          } else if (hitItem.type === 'blueStar') {
            setBlueStars(prev => prev.filter(s => s.id !== hitItem.id));
            blueStarRefs.current.delete(hitItem.id);
          } else if (hitItem.type === 'stone') {
            setStones(prev => prev.filter(s => s.id !== hitItem.id));
            stoneRefs.current.delete(hitItem.id);
          } else if (hitItem.type === 'blindBox') {
            setBlindBox(prev => prev.filter(s => s.id !== hitItem.id));
            blindBoxRefs.current.delete(hitItem.id);
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
                  setScore(prev => ({ original: prev.original + 10, newScore: 10 }));
                } else if (currentCarriedItem.type === 'blueStar') {
                  setScore(prev => ({ original: prev.original + 40, newScore: 40 }));
                } else if (currentCarriedItem.type === 'stone') {
                  setScore(prev => ({ original: prev.original - 10, newScore: -10 }));
                } else if (currentCarriedItem.type === 'blindBox') {
                  setScore(prev => ({ original: prev.original + 100, newScore: 100 }));
                  setDisplayRandomBlindBox({
                    isDisplay: true,
                    secretNumber: hitItem?.randomBlindBoxNumber || 0,
                  });
                } else if (currentCarriedItem.type === 'star') {
                  setScore(prev => ({ original: prev.original + 50, newScore: 50 }));
                }
                setCarriedItem(null);
                setIsUpScore(true);
              }
            }
          },
          currentCarriedItem ? 40 : 8,
        );
      }
    }, 4);
  }, [isExtending, checkCollisionWithBoundingRect, viewportBounds.containerHeight]);
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

  useEffect(() => {
    if (isUpScore) {
      setTimeout(() => {
        setIsUpScore(false);
      }, 800);
    }
  }, [isUpScore]);

  useEffect(() => {
    handleTimeInterval(59, true, '/gold-mining/result');
  }, []);

  useEffect(() => {
    if (score && timeLeft >= 0) {
      createCookie({
        name: 'goldMiningScore',
        value: JSON.stringify(score.original),
      });
    }
  }, [score]);

  // Ref callbacks
  const setHeartItemRef = useCallback(
    (id: number) => (element: HTMLDivElement | null) => {
      if (element) {
        heartItemRefs.current.set(id, element);
      } else {
        heartItemRefs.current.delete(id);
      }
    },
    [],
  );

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
      className="flex flex-col items-center min-h-screen bg-gold-mining-game pt-10 relative overflow-hidden"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Speaker */}
      <div className="absolute top-14 left-5">
        <SpeakerIcon />
      </div>

      {/* Clock */}
      <div className="clock-card w-[120px] h-[40px] absolute right-0 flex items-center">
        <ClockIcon className="translate-y-1" />
        <p className="text-shadow-custom text-[1rem] font-[590]">{isCounting ? timeLeft : 0}</p>
      </div>

      {/* Score */}
      <div className="clock-card w-[120px] h-[40px] absolute right-0 top-22 flex items-center space-x-3">
        <Image
          className="w-[1.5rem] h-[1.75rem] ms-3"
          src="/assets/badge-medal.png"
          width={100}
          height={100}
          alt="badge medal"
        />
        <p className="text-shadow-custom text-[1rem] font-[590]">{score.original}</p>
      </div>

      {/*  Blind box */}

      {
        displayRandomBlindBox.isDisplay && <RandomBlindBox secretNumber={displayRandomBlindBox.secretNumber} setDisplayRandomBlindBox={setDisplayRandomBlindBox} />
      }

      {/* Score Animation */}
      <p
        className={`${
          isUpScore ? '-translate-y-10 opacity-100' : ''
        } text-shadow-custom transition-all duration-300 opacity-0 absolute top-56 -translate-x-10`}
      >
        {score.newScore === -10 ? '' : '+'}
        {score.newScore}
      </p>

      {/* Robot + Hook */}
      <RobotHook angle={angle} carriedItem={carriedItem} hookRef={hookRef} hookTipMarkerRef={hookTipMarkerRef} isExtending={isExtending} isShrinking={isShrinking} isSwinging={isSwinging} ropeLength={ropeLength} />

      {/* Game Items */}
      <GameItems blindBox={blindBox} blueStars={blueStars} heartItems={heartItems} stars={stars} stones={stones} setStoneRef={setStoneRef} setBlindBoxRef={setBlindBoxRef} setBlueStarRef={setBlueStarRef} setHeartItemRef={setHeartItemRef} setStarRef={setStarRef} />

    </div>
  );
};

export default SpaceshipGame;
