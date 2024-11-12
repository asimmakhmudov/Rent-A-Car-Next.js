"use client";

import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { LuX } from 'react-icons/lu';
import { ModelFilterProps, ModelProps } from '@/types';

const ModelFilter = ({ options, selectedModel, setSelectedModel, selectedBrand }: ModelFilterProps) => {
    const [query, setQuery] = useState('');

    const handleModelSelection = (model: ModelProps) => {
        setSelectedModel(model);
        setQuery("");
    };

    const clearQuery = () => {
        setQuery("");
        setSelectedModel("");
    };

    const handleInputChange = (value: string) => {
        const matchingModel = options?.find(model => model.name?.toLowerCase() === value.toLowerCase());
        if (matchingModel) {
            setSelectedModel(matchingModel);
            setQuery(matchingModel.name || "");
        } else {
            setQuery(value);
            setSelectedModel("");
        }
    };

    const handleBlur = () => {
        const matchingModel = options?.find(model => model.name?.toLowerCase() === (query.toLowerCase() || (selectedModel && selectedModel?.name)?.toLowerCase()));
        if (!matchingModel) {
            clearQuery();
        }
    };

    const filterOptions = () => {
        if (!query) return options ?? [];

        const firstLetter = query[0].toLowerCase();
        const matchingModels = (options ?? []).filter(model => model.name?.toLowerCase().startsWith(firstLetter));
        const otherModels = (options ?? []).filter(model => !model.name?.toLowerCase().startsWith(firstLetter));

        return [...(matchingModels ?? []), ...(otherModels ?? [])];
    };
    
    return (
        <Combobox as='div' className="sm:mr-[8px] my-[8px] w-[100%]">
            <div className='relative cursor-pointer w-[100%]'>
                {selectedBrand ? (
                    <Combobox.Input
                        className="relative flex justify-between outline-none py-4 px-4 items-center cursor-pointer rounded-lg bg-white border border-gray-400 text-left shadow-md sm:text-sm z-10 lg:max-w-[350px] w-[100%]"
                        placeholder="Modellər"
                        value={selectedModel && 'name' in selectedModel ? selectedModel.name : query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={handleBlur}
                    />
                ) : (
                    <input
                        className="relative flex justify-between outline-none py-4 px-4 items-center cursor-not-allowed rounded-lg bg-gray-200 border border-gray-400 text-left shadow-md sm:text-sm z-10 lg:max-w-[350px] w-[100%]"
                        placeholder="Modellər"
                        value=""
                        disabled
                    />
                )}
                {(selectedModel !== "") && (
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
                        {filterOptions().map((model) => (
                            <Combobox.Option
                                key={model?.id}
                                value={model?.name}
                                onClick={() => handleModelSelection(model ?? "")}
                                className="relative flex items-center select-none py-[8px] px-[8px] text-black cursor-pointer hover:bg-gray-100"
                            >
                                {model?.name}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};

export default ModelFilter;
