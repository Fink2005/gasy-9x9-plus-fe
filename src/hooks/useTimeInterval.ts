import { redirect } from 'next/navigation';
import React, { useState } from 'react';

const useTimeInterval = () => {
  const [count, setCount] = useState<{
    isCounting: boolean;
    timeLeft: number;
  }>({
    isCounting: false,
    timeLeft: 0,
  });
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleTimeInterval = (timeLeft: number, isCounting: boolean, routeRedirect?: string) => {
    setCount({ isCounting, timeLeft });
    if (intervalRef.current) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev.timeLeft <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            routeRedirect && redirect(routeRedirect);
          }
          return { isCounting: false, timeLeft };
        }
        return { isCounting: true, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  return { handleTimeInterval, isCounting: count.isCounting, timeLeft: count.timeLeft, };
};

export default useTimeInterval;
