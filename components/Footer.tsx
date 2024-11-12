import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='flex flex-col w-full z-10 bg-[#020618] bottom-0'>
      <div className='max-w-[1880px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4'>
        <Link href='/' className='flex justify-center items-center'>
          <img src="/footer.png" alt="Way logo" width={118} height={10} className='object-contain w-16' />
        </Link>
      </div>
    </footer>
  )
}

export default Footer