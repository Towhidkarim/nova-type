import Link from 'next/link';
import siteLogo from '@/public/nova-type-logo.png';
import React from 'react';
import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className='flex flex-row justify-between mx-auto px-4 py-2 max-w-[100rem]'>
      <Link
        href='/'
        className='flex flex-row justify-center items-center gap-2 font-extrabold text-3xl'
      >
        <Image src={siteLogo} alt='nova' height={38} width={38} />
        <h5>
          Nova<span className='text-primary'>Type </span>
        </h5>
      </Link>
      <h1></h1>
    </nav>
  );
}
