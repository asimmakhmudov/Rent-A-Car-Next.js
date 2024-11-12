"use client"

import React, { useState } from "react";

function NewPassword() {
    const [email, setEmail] = useState("");
    const [isFocused, setIsFocused] = useState({ input1: false, input2: false });
    
    return (
        <div className="w-[100%] min-h-[95vh] h-[100%] bg-[#EDEFFD] flex items-center justify-center">
            <form className="flex flex-col justify-center items-center bg-[#FFF] sm:max-w-[750px] w-[95%] h-[auto] py-[40px] rounded-[10px]">
                <h2 className="font-semibold text-[32px]">Şifrə Yenilə</h2>
                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                    <input
                        type="email"
                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[10px] outline-none w-full px-[20px] py-[10px]"
                        value={email}
                        onFocus={() => setIsFocused({ ...isFocused, input2: true })}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (e.target.value !== '') {
                                setIsFocused({ ...isFocused, input2: true });
                            }
                        }}
                        onBlur={() => setIsFocused({ ...isFocused, input2: false })}
                        placeholder="Email daxil edin"
                        required
                    />
                    {isFocused.input2 && email && (
                        <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Email</span>
                    )}
                </div>

                <button className={`bg-[#000919] text-white py-4 sm:max-w-[500px] w-[90%] rounded-xl mt-[30px] cursor-pointer`}>
                    Göndər
                </button>
            </form>
        </div>
    );
}

export default NewPassword;
