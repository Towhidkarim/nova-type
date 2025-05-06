'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Word } from './word';
import { getWords } from '@/lib/getWords';
import { useAtom } from 'jotai';
import { useGlobalTimer } from '@/lib/hooks/useGlobalTimer';
import { testRunningAtom } from '@/lib/atoms';
import ControlSection from './ControlSection';

export default function TypeSection({ wordList }: { wordList: string[] }) {
  const myWords = wordList;
  const [testRunning, setTestRunning] = useAtom(testRunningAtom);
  const [keyStrokesEnabled, setKeyStrokesEnabled] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const testDurationSeconds = 30;

  const [currentWord, setCurrentWord] = useState('');
  const [previousWords, setPreviousWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const hideBefore = useRef(0);
  const currentLine = useRef(1);
  const { time, setTime, start, pause, reset } = useGlobalTimer();
  const wordIndexRef = useRef({ word: '', index: 0 });
  const previousWordsRef = useRef(previousWords);
  const typeboxRef = useRef<HTMLDivElement>(null);

  const [caretAbspos, setCaretAbsPos] = useState({ x: 0, y: 0 });

  const lastLineLastIndex = useRef<{ curr: number; prev: number }>({
    curr: 1000,
    prev: 1000,
  });

  const handleCaretPosChange = ({ x, y }: { x: number; y: number }) => {
    //both updates caret position as well handles line changes
    if (x < caretAbspos.x && y > caretAbspos.y) {
      currentLine.current = currentLine.current + 1;
      lastLineLastIndex.current = {
        //sets the indexes of the last word on the current and previous line
        prev: lastLineLastIndex.current.curr,
        curr: currentWordIndex,
      };
      if (currentLine.current > 2) {
        //changes occurs from third line and so on
        hideBefore.current = lastLineLastIndex.current.prev;
        currentLine.current--; //since eternally ont he second line
        setCaretAbsPos({ x, y: caretAbspos.y }); //no changes of y after line 2
        return;
      }
    } else if (x > caretAbspos.x && y < caretAbspos.y) {
      currentLine.current = currentLine.current - 1;
    }
    setCaretAbsPos({ x, y });
  };

  const getCaretRelativePos = () => {
    if (!typeboxRef.current) return { x: 0, y: 0 };
    const rect = typeboxRef.current.getBoundingClientRect();
    const x = caretAbspos.x - rect.x;
    const y = caretAbspos.y - rect.y;
    return { x, y };
  };

  // Control functions
  const startTest = (timeSeconds: number = 30) => {
    reset();
    pause();
    setTime(timeSeconds);
    start();
    setShowResults(false);
  };

  const stopTest = () => {
    pause();
    setTime(0);
    setKeyStrokesEnabled(false);
    setTestRunning(false);
    // setShowResults(true);
  };

  const resetTest = () => {
    setTime(30);
    setKeyStrokesEnabled(true);
    setShowResults(false);
    setCurrentWordIndex(0);
    setCurrentWord('');
    setPreviousWords([]);
    lastLineLastIndex.current = {
      curr: 1000,
      prev: 1000,
    };
    hideBefore.current = 0;
    currentLine.current = 1;
  };

  useEffect(() => {
    wordIndexRef.current = { word: currentWord, index: currentWordIndex };
  }, [currentWord, currentWordIndex]);
  useEffect(() => {
    previousWordsRef.current = [...previousWords];
  }, [previousWords]);

  useEffect(() => {
    if (testRunning) startTest();
    if (time <= 0) {
      stopTest();
      setShowResults(true);
    }
  }, [time, testRunning]);

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      if (!keyStrokesEnabled) return; //do nothing on input in this case
      const { word, index } = wordIndexRef.current;
      // console.log(e.key);
      if (e.key === 'Backspace') {
        if (
          word.length === 0 &&
          index > 0 &&
          previousWordsRef.current[index - 1] !== myWords[index - 1] //if previous word was incorrect
        ) {
          //set the previous word and indexes as current
          setCurrentWordIndex((prev) => prev - 1);
          setCurrentWord(previousWordsRef.current[index - 1]);
          setPreviousWords((prev) => [...prev.slice(0, prev.length - 1)]);
        } else setCurrentWord((prev) => prev.slice(0, prev.length - 1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        setTestRunning(true);
        setCurrentWord((prev) => (prev + e.key).toLowerCase());
      }

      if (e.key === ' ' && word.length > 0) {
        setCurrentWordIndex((prev) => prev + 1);
        setPreviousWords((prev) => [...prev, word]);
        setCurrentWord('');
      }
    };
    window.addEventListener('keydown', eventHandler);

    return () => {
      window.removeEventListener('keydown', eventHandler);
    };
  }, [keyStrokesEnabled]);
  return (
    <section className='relative'>
      <div
        className='z-10 absolute inset-0 place-items-center grid bg-primary/10 backdrop-blur-xl rounded-xl w-full h-44 text-4xl text-center'
        style={{
          display: showResults ? 'block' : 'none',
        }}
      >
        <span className='top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2'>
          {previousWordsRef.current.length} <br /> WPM
        </span>
      </div>
      <div className='max-h-40 overflow-clip'>
        <div
          ref={typeboxRef}
          className='relative flex flex-row flex-wrap gap-4 p-1 h-fit font-medium text-4xl select-none'
        >
          {myWords.map((item, wi) => {
            if (wi >= hideBefore.current) {
              return (
                <Word
                  setCaretPos={handleCaretPosChange}
                  active={currentWordIndex === wi}
                  currentText={
                    currentWordIndex === wi
                      ? currentWord
                      : wi < currentWordIndex
                      ? previousWords[wi]
                      : ''
                  }
                  word={item}
                  key={wi}
                />
              );
            } else return '';
          })}
          <div
            className='absolute bg-foreground/90 rounded-full w-[2px] h-10 transition-all'
            style={{
              left: getCaretRelativePos().x - 1,
              top: getCaretRelativePos().y,
            }}
          ></div>
        </div>
      </div>
      <ControlSection resetTest={resetTest} />
    </section>
  );
}
