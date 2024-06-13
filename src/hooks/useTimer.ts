import { useCallback, useEffect, useRef, useState } from "react";

const useTimer = (duration: number) => {
  const [seconds, setSeconds] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout>();

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      setSeconds(duration);
    }
  }, [duration]);

  const start = useCallback(() => {
    stop();
    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
          return 0;
        }
      });
    }, 1000);
  }, [stop]);

  const setDuration = useCallback(
    (newSeconds: number) => {
      stop();
      setSeconds(newSeconds);
    },
    [stop]
  );

  useEffect(() => {
    return stop;
  }, [stop]);

  return { seconds, start, stop, setDuration };
};

export { useTimer };
