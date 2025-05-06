import ControlSection from '@/components/ControlSection';
import Timer from '@/components/Timer';
import TypeSection from '@/components/TypeSection';
import { getWords } from '@/lib/getWords';
import Image from 'next/image';

export default function Home() {
  const myWords = getWords();
  return (
    <main className='relative place-items-center gap-0 grid w-screen min-h-screen'>
      <div className='max-w-[80%]'>
        <Timer />
        <TypeSection wordList={myWords} />
        {/* <ControlSection /> */}
      </div>
    </main>
  );
}
