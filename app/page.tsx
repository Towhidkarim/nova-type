import ControlSection from '@/components/ControlSection';
import NavBar from '@/components/NavBar';
import Timer from '@/components/Timer';
import TypeSection from '@/components/TypeSection';
import { getWords } from '@/lib/getWords';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function Home() {
  const DEFAULT_WORD_COUNT = 150;
  return (
    <main className='relative gap-0 w-screen min-h-screen'>
      <NavBar />
      <div className='top-1/2 left-1/2 absolute mx-auto w-[90%] max-w-[100rem] -translate-1/2'>
        <Timer />
        <TypeSection wordList={getWords(DEFAULT_WORD_COUNT)} />
        {/* <ControlSection /> */}
      </div>
    </main>
  );
}
