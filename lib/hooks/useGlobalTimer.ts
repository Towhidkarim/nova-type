import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

export const initialTimeAtom = atom(30);
export const timeAtom = atom(30);
export const isRunningAtom = atom(false);

let interval: NodeJS.Timeout | null = null;
const timerControlAtom = atom(
  null,
  (get, set, action: 'start' | 'pause' | 'reset') => {
    const clear = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    switch (action) {
      case 'start':
        if (!get(isRunningAtom)) {
          set(isRunningAtom, true);
          set(timeAtom, get(initialTimeAtom));
          interval = setInterval(() => {
            set(timeAtom, (t) => t - 1);
          }, 1000);
        }
        break;

      case 'pause':
        clear();
        set(isRunningAtom, false);
        break;

      case 'reset':
        clear();
        set(timeAtom, get(initialTimeAtom));
        set(isRunningAtom, false);
        break;
    }
  }
);

export function useGlobalTimer() {
  const [time, setTime] = useAtom(timeAtom);
  const [isRunning] = useAtom(isRunningAtom);
  const [, control] = useAtom(timerControlAtom);

  const start = () => control('start');
  const pause = () => control('pause');
  const reset = () => control('reset');

  return { time, setTime, isRunning, start, pause, reset };
}
