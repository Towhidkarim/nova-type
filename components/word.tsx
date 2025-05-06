'use client';

import React, { useEffect, useRef, useState } from 'react';

export const Word = React.memo(
  ({
    currentText,
    word,
    active,
    setCaretPos,
  }: {
    currentText: string;
    word: string;
    active: boolean;
    setCaretPos: ({ x, y }: { x: number; y: number }) => void;
  }) => {
    const maxLength =
      currentText.length > word.length ? currentText.length : word.length;

    const wordRef = useRef<HTMLDivElement>(null);

    const letterStatus: {
      value: string;
      status: 'untyped' | 'correct' | 'incorrect' | 'extra';
    }[] = [];

    for (let i = 0; i < maxLength; i++) {
      const wi = word[i];
      const cti = currentText[i];
      if (cti === undefined)
        letterStatus.push({ value: wi, status: 'untyped' });
      else if (wi === undefined)
        letterStatus.push({ value: cti, status: 'extra' });
      else if (cti === wi) letterStatus.push({ value: cti, status: 'correct' });
      else if (cti !== wi)
        letterStatus.push({ value: wi, status: 'incorrect' });
    }

    useEffect(() => {
      const letters = wordRef.current?.querySelectorAll('span.letter');
      const targetLetter =
        letters?.[currentText.length !== 0 ? currentText.length - 1 : 0];
      if (!targetLetter) return;
      const { offsetLeft, offsetWidth } = targetLetter as HTMLSpanElement;
      const rect = targetLetter.getBoundingClientRect();

      if (!active) return;
      const x = rect.left;
      const y = rect.top;
      if (letterStatus[0].status === 'untyped') {
        setCaretPos({ x, y });
      } else
        setCaretPos({
          x: x + offsetWidth,
          y,
        });
    }, [currentText, active]);

    const getStatusClass = (
      status: (typeof letterStatus)[number]['status']
    ) => {
      switch (status) {
        case 'correct':
          return 'text-foreground/80';
        case 'incorrect':
          return 'text-rose-500';
        case 'extra':
          return 'text-destructive';
        case 'untyped':
          return 'text-gray-400/55';
        default:
          return '';
      }
    };

    return (
      <div ref={wordRef} className='flex flex-row gap-[2px]'>
        {letterStatus.map((item, index) => (
          <span
            className={`letter transition-colors ${getStatusClass(
              item.status
            )}`}
            key={index}
          >
            {item.value}
          </span>
        ))}
      </div>
    );
  }
);
