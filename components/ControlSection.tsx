'use client';

import { testRunningAtom } from '@/lib/atoms';
import { useGlobalTimer } from '@/lib/hooks/useGlobalTimer';
import { useAtom } from 'jotai';
import { PlayIcon, RotateCcw } from 'lucide-react';
import Button from './ui/button';
import React, { useEffect } from 'react';

function ControlSection({
  resetTest,
  startNewTest,
}: {
  startNewTest: () => void;
  resetTest: () => void;
}) {
  //   const { setTime, start, pause } = useGlobalTimer();
  // const [testRunning, setTestRunning] = useAtom(testRunningAtom);
  useEffect(() => {
    const keyDownEvent = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.ctrlKey) resetTest();
      else if (e.key == 'Enter' && e.ctrlKey) startNewTest();
    };
    window.addEventListener('keydown', keyDownEvent);
    return () => {
      window.removeEventListener('keydown', keyDownEvent);
    };
  }, []);
  return (
    <div className='flex flex-row justify-center items-center gap-5 mx-auto my-10 w-fit'>
      <div className='relative'>
        <Button
          onClick={(e) => {
            setTimeout(resetTest, 300);
            e.currentTarget.blur();
          }}
          className='flex flex-row gap-2'
        >
          <RotateCcw />
          Restart
        </Button>
        <div className='-bottom-4/5 left-1/2 absolute flex justify-center items-center gap-2 opacity-45 w-20 font-light text-xs -translate-x-1/2'>
          <span className='block bg-secondary p-1 rounded-lg'>ctrl</span>+
          <span className='block bg-secondary p-1 rounded-lg'>space</span>
        </div>
      </div>
      <div className='relative'>
        <Button
          onClick={(e) => {
            startNewTest();
            e.currentTarget.blur();
          }}
          className='flex flex-row gap-2'
        >
          <PlayIcon />
          New Test
        </Button>
        <div className='-bottom-4/5 left-1/2 absolute flex justify-center items-center gap-2 opacity-45 w-20 font-light text-xs -translate-x-1/2'>
          <span className='block bg-secondary p-1 rounded-lg'>ctrl</span>+
          <span className='block bg-secondary p-1 rounded-lg'>enter</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ControlSection);
