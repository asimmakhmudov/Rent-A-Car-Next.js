"use client"

import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { LuX } from 'react-icons/lu';
import { CityFilterProps, CityProps } from '@/types';

const CityFilter = ({ options, selectedCity, setSelectedCity}: CityFilterProps) => {
    const [query, setQuery] = useState('');
    const handleCitySelection = (city: CityProps) => {
        setSelectedCity(city);
        setQuery("");
    };

    const clearQuery = () => {
        setQuery("");
        setSelectedCity("");
    };

    const handleInputChange = (value: string) => {
        const matchingCity = options?.find(city => city.name?.toLowerCase() === value.toLowerCase());
        if (matchingCity) {
            setSelectedCity(matchingCity);
            setQuery(matchingCity.name || "");
        } else {
            setQuery(value);
            setSelectedCity("");
        }
    };

    const filterOptions = () => {
        if (!query) return options ?? [];
    
        const firstLetter = query[0].toLowerCase();
        const matchingCities = (options ?? []).filter(city => city.name?.toLowerCase().startsWith(firstLetter));
        const otherCities = (options ?? []).filter(city => !city.name?.toLowerCase().startsWith(firstLetter));
    
        return [...(matchingCities ?? []), ...(otherCities ?? [])];
    };

    const handleBlur = () => {
        const matchingCity = options?.find(city => city.name?.toLowerCase() === (query.toLowerCase() || (selectedCity && selectedCity?.name)?.toLowerCase()));
        if (!matchingCity) {
            clearQuery();
        }
    };
    
    
    return (
        <Combobox as='div' className="sm:mr-[8px] my-[8px] w-[100%]">
            <div className='relative cursor-pointer w-[100%]'>
                <Combobox.Input
                    className="relative flex justify-between outline-none py-4 px-4 items-center cursor-pointer rounded-lg bg-white border border-gray-400 text-left shadow-md sm:text-sm z-10 lg:max-w-[350px] w-[100%]"
                    placeholder="City"
                    value={selectedCity ? selectedCity.name : query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={handleBlur}
                />
                {(selectedCity && selectedCity.name) && (
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
                        {filterOptions().map((city) => (
                            <Combobox.Option
                                key={city?.id}
                                value={city?.name}
                                onClick={() => handleCitySelection(city ?? "")}
                                className="relative flex items-center select-none py-[8px] px-[8px] text-black cursor-pointer hover:bg-gray-100"
                            >
                                {city?.name}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};

export default CityFilter;