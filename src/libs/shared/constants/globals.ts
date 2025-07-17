export const USER_RANKING_LIMIT = 15;

// Format timeRestore thành mm:ss
export const formatMsToCountdown = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// Example
