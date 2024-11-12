"use client"
import { CustomTableProps } from '@/types'
import React from 'react'

const CustomTable = ({ title, tbodyContent, theadContent }: CustomTableProps) => {
    return (
        <div className='flex flex-col border border-[#000919] p-[2px] h-[100%] w-[100%] rounded-[12px] py-[10px] overflow-x-auto overflow-y-auto transition-width duration-300 ease-in-out'>

            <div className='flex items-center justify-between w-[100%] sticky left-0 top-0'>
                <h1 className='sm:mx-6 mx-2 my-4 whitespace-no-wrap font-extrabold sm:text-[20px] text-[16px]'>{title}</h1>
                {theadContent}
            </div>

            <table className="w-[100%]">
                {tbodyContent}
            </table>
        </div>
    )
}

export default CustomTable