"use client"
import { ColorFilterProps, ColorProps } from '@/types';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LuX } from "react-icons/lu";
import { Listbox, Transition } from '@headlessui/react';

const ColorFilter = ({ title, options, selectedColor, setSelectedColor}: ColorFilterProps) => {
    const router = useRouter();

    const handleColorSelection = (colorValue: ColorProps) => {
        setSelectedColor(colorValue);
    };

    const handleRemoveColor = () => {
        setSelectedColor("");
    };

    return (
        <Listbox as='div' className="my-[8px] w-[100%]">
            <div className="relative cursor-pointer w-[100%]">
                <Listbox.Button className="custom-filter__btn">
                    <span className="block truncate cursor-pointer">
                        {selectedColor ? (
                            <span className="flex items-center">
                                <span
                                    className="w-4 h-4 rounded-full border border-black mr-2"
                                    style={{ backgroundColor: selectedColor.code }}
                                ></span>
                                {selectedColor.name}
                            </span>
                        ) : (
                            <span className="flex items-center text-gray-400">
                                {title}
                            </span>
                        )}
                    </span>
                    <img
                        src="/chevron-up-down.svg"
                        width={20}
                        height={20}
                        className="ml-4 object-contain"
                        alt="chevron_up-down"
                    />
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="custom-filter__options">
                        {selectedColor && (
                            <button
                                className="flex justify-start items-center text-left py-[8px] px-[8px] w-full text-gray-500 hover:bg-gray-100 bg-white"
                                onClick={handleRemoveColor}
                            >
                                <LuX className="block mx-[10px] text-[18px] text-[red]"/>
                                Sıfırla
                            </button>
                        )}
                        {options?.map((option) => (
                            <Listbox.Option
                                key={option?.id}
                                className="relative flex items-center select-none py-[8px] px-[8px] text-black cursor-pointer hover:bg-gray-100"
                                value={option?.id}
                                onClick={() => handleColorSelection(option)}
                            >
                                <span className={`w-[20px] h-[20px] rounded-full border mx-[10px] border-black`} style={{ backgroundColor: `${option?.code}` }} />
                                <span className={`block truncate font-normal`}>{option?.name}</span>
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export default ColorFilter;
