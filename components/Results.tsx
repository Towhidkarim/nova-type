'use client';
import { cn } from '@/lib/utils';
import React, { useCallback, useMemo } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import Button from './ui/button';
import ToolTip from './ui/tooltip';
import { useAtom } from 'jotai';
import { testDurationAtom } from '@/lib/atoms';
import calculateAccuracy from '@/lib/calculateAccuracy';

export default function Results({
  show,
  typedWords,
  sourceWords,
  restartFunction,
  newTestFunction,
}: {
  show: boolean;
  typedWords: string[];
  sourceWords: string[];
  restartFunction: () => void;
  newTestFunction: () => void;
}) {
  const [testDurationSeconds] = useAtom(testDurationAtom);
  const { accuracy } = useMemo(
    () => calculateAccuracy(typedWords, sourceWords),
    [show]
  );
  const calculateMetrics = useCallback(
    () => [
      {
        value: `${Math.round(typedWords.length * (60 / testDurationSeconds))}`,
        title: 'WPM',
        subtitle: 'words per minute',
      },
      {
        value: `${Math.round(accuracy * 100)}%`,
        title: 'Accuracy',
        subtitle: 'Correct Characters',
      },
      {
        value: `${testDurationSeconds}s`,
        title: 'Time',
        subtitle: 'Test Duration',
      },
    ],
    [show]
  );

  return (
    <div
      className={cn(
        'z-10 absolute inset-0 transition-all origin-center place-items-center duration-150 grid bg-primary/10 backdrop-blur-xl rounded-xl w-full h-64 text-center select-none',
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      )}
    >
      <div className='my-5'>
        <div className='flex flex-row gap-2 w-full'>
          {calculateMetrics().map((metric, index) => (
            <div
              key={index}
              className='flex flex-col justify-center items-center gap-0 bg-primary-foreground/10 p-5 rounded-lg w-48 h-36'
            >
              <span className='font-semibold text-5xl'>{metric.value}</span>
              <span className='font-light text-foreground/80 text-base'>
                {metric.title}
              </span>
              <span className='text-foreground/40 text-sm'>
                {metric.subtitle}
              </span>
            </div>
          ))}
        </div>
        <div className='flex flex-row justify-center items-center gap-8 mx-auto my-5 p-3 w-fit h-20'>
          <ToolTip text='Restart Test'>
            <Button
              onClick={(e) => {
                e.currentTarget.blur();
                restartFunction();
              }}
            >
              <RotateCcw />
            </Button>
          </ToolTip>
          <ToolTip text='New Test'>
            <Button
              onClick={(e) => {
                e.currentTarget.blur();
                newTestFunction();
              }}
            >
              <Play />
            </Button>
          </ToolTip>
        </div>
      </div>
    </div>
  );
}
