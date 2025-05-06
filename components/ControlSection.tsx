'use client';

import { testRunningAtom } from '@/lib/atoms';
import { useGlobalTimer } from '@/lib/hooks/useGlobalTimer';
import { useAtom } from 'jotai';

export default function ControlSection({
  resetTest,
}: {
  resetTest: () => void;
}) {
  //   const { setTime, start, pause } = useGlobalTimer();
  const [testRunning, setTestRunning] = useAtom(testRunningAtom);
  return (
    <div className='mx-auto w-full'>
      <button
        onClick={() => resetTest()}
        className='block hover:bg-foreground/10 mx-auto my-10 px-3 py-2 border border-foreground/20 rounded-lg active:scale-95 transition-all cursor-pointer'
      >
        Retry
      </button>
    </div>
  );
}
