import { useEffect, useRef } from "react";

/**
 * Custom hook for polling a function call at specified intervals.
 *
 * @param callback - The function to be called repeatedly.
 * @param interval - The interval in milliseconds between each call.
 */
const usePolling = (callback: () => void, interval: number): void => {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current?.();
    };
    if (interval !== null) {
      const id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
  }, [interval]);
};

export default usePolling;
