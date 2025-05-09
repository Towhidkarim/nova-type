'use client';

import { useGlobalTimer } from '@/lib/hooks/useGlobalTimer';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Button from './ui/button';
import { cn } from '@/lib/utils';
import { testDurationAtom, testRunningAtom } from '@/lib/atoms';

export default function Timer() {
  const { time, setTime } = useGlobalTimer();
  const [testDurationSeconds, setTestDurationSeconds] =
    useAtom(testDurationAtom);
  const [testRunning] = useAtom(testRunningAtom);
  const handleDurationChange = (duration: number) => {
    setTestDurationSeconds(duration);
    setTime(duration);
  };

  const durationOptions = [15, 30, 60];

  return (
    <div className='ml-2'>
      <h4 className='mb-1 w-full text-foreground/50 text-xs text-center'>
        Set Duration
      </h4>
      <div className='place-content-center grid'>
        <div className='flex flex-row gap-0'>
          {durationOptions.map((duration, index) => (
            <Button
              disabled={testRunning}
              key={duration}
              onClick={(e) => {
                handleDurationChange(duration);
                e.currentTarget.blur();
              }}
              className={cn(
                {
                  'rounded-r-none': index === 0,
                  'rounded-none': index === 1,
                  'rounded-l-none': index === durationOptions.length - 1,
                  'bg-primary/50': testDurationSeconds === duration,
                },
                'w-12'
              )}
            >
              {duration}
            </Button>
          ))}
        </div>
      </div>
      <h5 className='my-2 text-foreground/50 text-xs text-center'>seconds</h5>
      <h4 className='text-foreground/50 text-xs'>Timer (seconds)</h4>
      <h2 className='my-2 text-foreground/90 text-4xl'>{time}</h2>
    </div>
  );
}
