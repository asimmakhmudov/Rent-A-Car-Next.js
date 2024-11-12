"use client";

import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { LuX } from 'react-icons/lu';
import { BrandProps, BrandFilterProps } from '@/types';

const BrandFilter = ({ options, selectedBrand, setSelectedBrand, setSelectedModel }: BrandFilterProps) => {
    const [query, setQuery] = useState('');

    const handleBrandSelection = (brand: BrandProps) => {
        setSelectedBrand(brand);
        setQuery('');
    };

    const clearQuery = () => {
        setQuery('');
        setSelectedBrand('');
        setSelectedModel('');
    };

    const handleInputChange = (value: string) => {
        const matchingBrand = options?.find(brand => brand.name?.toLowerCase() === value.toLowerCase());
        if (matchingBrand) {
            setSelectedBrand(matchingBrand);
            setQuery(matchingBrand.name || '');
        } else {
            setQuery(value);
            setSelectedBrand('');
        }
    };

    const handleBlur = () => {
        const matchingBrand = options?.find(brand => brand.name?.toLowerCase() === (query.toLowerCase() || (selectedBrand && selectedBrand?.name)?.toLowerCase()));
        if (!matchingBrand) {
            clearQuery();
        }
    };

    const filterOptions = () => {
        if (!query) return options ?? [];

        const firstLetter = query[0].toLowerCase();
        const matchingBrands = (options ?? []).filter(brand => brand.name?.toLowerCase().startsWith(firstLetter));
        const otherBrands = (options ?? []).filter(brand => !brand.name?.toLowerCase().startsWith(firstLetter));

        return [...(matchingBrands ?? []), ...(otherBrands ?? [])];
    };

    return (
        <Combobox as='div' className="sm:mr-[8px] my-[8px] w-[100%]">
            <div className='relative cursor-pointer'>
                <Combobox.Input
                    className="relative flex justify-between outline-none py-4 px-4 items-center cursor-pointer rounded-lg bg-white border border-gray-400 text-left shadow-md sm:text-sm z-10 lg:max-w-[350px] w-[100%]"
                    placeholder="Marka"
                    value={selectedBrand && selectedBrand.name ? selectedBrand.name : query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={handleBlur}
                />
                {(selectedBrand && selectedBrand.name) && (
                    <button
                        onClick={clearQuery}
                        className="absolute right-[10px] top-[18px] z-[999] text-[#000919] outline-none focus:outline-none bg-white"
                    >
                        <LuX />
                    </button>
                )}

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Combobox.Options className="custom-filter__options">
                        {query && filterOptions().length === 0 && (
                            <Combobox.Option
                                value=""
                                className={({ active }) =>
                                    `relative flex items-center select-none py-[8px] px-[8px] text-black cursor-pointer hover:bg-gray-100`
                                }
                            >
                                Nothing found
                            </Combobox.Option>
                        )}
                        {filterOptions().map((brand) => (
                            <Combobox.Option
                                key={brand?.id}
                                value={brand?.name}
                                onClick={() => handleBrandSelection(brand)}
                                className="relative flex items-center select-none py-[8px] px-[8px] text-black cursor-pointer hover:bg-gray-100"
                            >
                                {brand?.name}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};

export default BrandFilter;
