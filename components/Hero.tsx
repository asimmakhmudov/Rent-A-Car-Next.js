"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { CustomButton } from '.'
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getUserType, getUser } from '@/lib/slices/userSlice';
import Cookies from 'js-cookie';



const Hero = () => {
  const handleLink = () => window.location.replace('/cars')

  return (
    <>
      <div className='flex flex-col relative h-[100vh]'>
        <img src="/herobg.jpg" alt="" className='absolute top-0 left-0 h-[100vh] object-cover z-[0] w-[100%]' />
        <div className='w-[100%] h-[100%] flex justify-center items-center flex-col z-[1] herobg'>
          <h1 className='sm:text-[42px] text-[28px] font-extrabold text-center text-[#000919] max-w-[990px] max-sm:w-[95%]'>
            Arzuladığın avtomobili sürmək
            hələ bu qədər sənə yaxın olmamışdı
          </h1>
          <p className='sm:text-[28px] text-[14px] text-center text-[#000919] font-bold mt-5 max-w-[900px] max-sm:w-[95%]'>
            İstədiyin avtomobili seç, özünə uyğun vaxtı təyin et sür və yolçuluqdan həzz al
          </p>
          <CustomButton
            title="Avtomobil Axtar"
            btnType="button"
            containerStyles="bg-[#000919] text-white rounded-lg mt-10"
            handleClick={handleLink}
          />
        </div>
      </div>
    </>
  )
}

export default Hero