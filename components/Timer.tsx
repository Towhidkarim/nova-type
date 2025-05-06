'use client';

import { useGlobalTimer } from '@/lib/hooks/useGlobalTimer';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export default function Timer() {
  const { time } = useGlobalTimer();

  return (
    <div>
      <h2 className='my-2 text-foreground/90 text-4xl'>{time}</h2>
    </div>
  );
}
