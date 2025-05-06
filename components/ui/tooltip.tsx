'use client';

import { useState } from 'react';

export default function ToolTip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  const [toolTipVisible, setToolTipVisible] = useState(false);
  return (
    <div
      className='inline relative h-fit'
      onMouseEnter={() => setToolTipVisible(true)}
      onMouseLeave={() => setToolTipVisible(false)}
    >
      {children}
      <div
        className='top-0 left-1/2 z-20 absolute bg-background p-1 rounded-lg min-w-20 h-auto text-foreground/80 text-xs origin-bottom transition -translate-x-1/2'
        style={{ scale: toolTipVisible ? 1 : 0 }}
      >
        {text}
      </div>
    </div>
  );
}
