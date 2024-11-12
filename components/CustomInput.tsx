import { CustomInputProps } from '@/types';
import React from 'react'

const CustomInput = ({ inputType, onChange, onBlur, onFocus, placeholder, value, required, name, disabled }: CustomInputProps) => {
    return (
        <>
            <input
                type={inputType}
                className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                value={value}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
            />
            <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">{name}</span>
        </>
    )
}

export default CustomInput