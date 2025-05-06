'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Word } from './word';
import { getWords } from '@/lib/getWords';
import { useAtom } from 'jotai';
import { useGlobalTimer } from '@/lib/hooks/useGlobalTimer';
import { testDurationAtom, testRunningAtom } from '@/lib/atoms';
import ControlSection from './ControlSection';
import Results from './Results';

export default function TypeSection({ wordList }: { wordList: string[] }) {
  const [wordSource, setWordSource] = useState(wordList);
  const [testRunning, setTestRunning] = useAtom(testRunningAtom);
  const keyStrokesEnabled = useRef(true);
  const [showResults, setShowResults] = useState(false);
  const [testDurationSeconds] = useAtom(testDurationAtom);

  const [currentWord, setCurrentWord] = useState('');
  const [previousWords, setPreviousWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const wordIndexRef = useRef({ word: '', index: 0 });
  const previousWordsRef = useRef(previousWords);

  const hideBefore = useRef(0);
  const currentLine = useRef(1);

  const typeboxRef = useRef<HTMLDivElement>(null);
  const [caretAbspos, setCaretAbsPos] = useState({ x: 0, y: 0 });

  const { time, setTime, start, pause, reset } = useGlobalTimer();

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
  const startTest = () => {
    reset();
    pause();
    setTime(testDurationSeconds);
    start();
    setShowResults(false);
  };

  const stopTest = () => {
    pause();
    setTime(0);
    keyStrokesEnabled.current = false;
    setTestRunning(false);
    // setShowResults(true);
  };

  const resetTest = () => {
    pause();
    setTime(testDurationSeconds);
    keyStrokesEnabled.current = true;
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

  const startNewTest = () => {
    const newWordList = getWords(100);
    setWordSource(newWordList);
    resetTest();
  };

  useEffect(() => {
    wordIndexRef.current = { word: currentWord, index: currentWordIndex };
  }, [currentWord, currentWordIndex]);
  useEffect(() => {
    previousWordsRef.current = [...previousWords];
  }, [previousWords]);

  useEffect(() => {
    if (time <= 0) {
      stopTest();
      setShowResults(true);
    }
  }, [time]);
  useEffect(() => {
    if (testRunning) startTest();
  }, [testRunning]);

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      if (!keyStrokesEnabled.current) return; //do nothing on input in this case
      const { word, index } = wordIndexRef.current;
      // console.log(e.key);
      if (e.key === 'Backspace') {
        if (
          word.length === 0 &&
          index > 0 &&
          previousWordsRef.current[index - 1] !== wordSource[index - 1] //if previous word was incorrect
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
  }, []);
  return (
    <section className='relative'>
      <Results
        newTestFunction={startNewTest}
        restartFunction={resetTest}
        show={showResults}
        sourceWords={wordSource}
        typedWords={previousWordsRef.current}
      />
      <div className='max-h-40 overflow-clip'>
        <div
          ref={typeboxRef}
          className='relative flex flex-row flex-wrap gap-4 p-1 h-fit font-medium text-4xl select-none'
        >
          {wordSource.map((item, wi) => {
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
