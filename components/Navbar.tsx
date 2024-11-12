"use client"
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Cookies from 'js-cookie';

import { CustomButton, MyDropdown } from '.'
import { LuLogOut, LuUserCircle, LuLayoutDashboard } from "react-icons/lu";
import { useAppDispatch } from '@/lib/hooks';
import { getUserType } from '@/lib/slices/userSlice';
import { HiOutlineMenuAlt1 } from "react-icons/hi";

const Navbar = () => {

    const authToken = Cookies.get('token');
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (authToken) {
            dispatch(getUserType({ Authorization: authToken }));
        }
    }, [dispatch, authToken]);

    const handleSignout = () => {
        Cookies.remove('token');
        window.location.replace("/auth");
    };

    const links = [
        { name: `Dashboard`, href: `/dashboard`, icon: <LuLayoutDashboard className='mx-[10px] text-[16px] text-[#000919]' /> },
        { name: `Signout`, href: ``, icon: <LuLogOut className='mx-[10px] text-[16px] text-[#000919]' />, signout: handleSignout },
    ]
    return (
        <header className='w-full absolute z-10 bg-transparent'>
            <nav className='max-w-[1880px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4'>
                <Link href='/' className='flex justify-center items-center'>
                    {/* <Image src="/logo.png" alt="Way logo" width={118} height={18} className='object-contain w-24' /> */}
                    <h1 className='text-[#000919] text-[32px] font-extrabold'>THE WAY</h1>
                </Link>
                {authToken ?
                    <MyDropdown
                        myDropdownHeader={
                            <HiOutlineMenuAlt1 className="inline-flex w-[40px] h-[40px] justify-center items-center text-sm font-normal text-[#000919] text-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75" />
                        }
                        myDropdownContent={
                            <>
                                {
                                    links.map((item, active) => (
                                        <Link
                                            key={item.name}
                                            href={item?.href}
                                            className={`group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-slate-100`}
                                            onClick={item?.signout}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    ))
                                }
                            </>
                        } />
                    :
                    <Link href='/auth'>
                        <CustomButton title='Daxil ol' btnType="button" containerStyles='bg-[#000919] text-white rounded-lg min-w-[130px]' />
                    </Link>
                }
            </nav>
        </header>
    )
}

export default Navbar