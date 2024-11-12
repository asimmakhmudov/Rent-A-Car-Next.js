"use client"

import React from 'react'
import { Menu } from '@headlessui/react';
import { LuLogOut, LuUserCircle2, LuLayoutDashboard } from "react-icons/lu";
import Link from 'next/link';
import { MyDropdownProps } from '@/types';

const MyDropdown = ({myDropdownHeader, myDropdownContent}:MyDropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button>{myDropdownHeader}</Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <Menu.Item as="div">
          {myDropdownContent}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default MyDropdown