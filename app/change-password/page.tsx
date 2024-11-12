"use client"

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePassword() {
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState({ input1: false, input2: false });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isValid = password1 === password2 && password1.trim() !== "";

    return (
        <div className="w-[100%] min-h-[95vh] h-[100%] bg-[#EDEFFD] flex items-center justify-center">
            <form className="flex flex-col justify-center items-center bg-[#FFF] sm:max-w-[750px] w-[95%] h-[auto] py-[40px] rounded-[10px]">
                <h2 className="font-semibold text-[32px]">Yeni Şifrə</h2>
                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[10px] outline-none w-full px-[20px] py-[10px]"
                        value={password1}
                        onFocus={() => setIsFocused({ ...isFocused, input1: true })}
                        onChange={(e) => {
                            setPassword1(e.target.value);
                            if (e.target.value !== "") {
                                setIsFocused({ ...isFocused, input1: true });
                            }
                        }}
                        onBlur={() => setIsFocused({ ...isFocused, input1: false })}
                        placeholder="Şifrənizi daxil edin"
                        required
                    />
                    {isFocused.input1 && password1 && (
                        <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Şifrənizi daxil edin</span>
                    )}
                    <div className="absolute right-[15px] top-[35%]">
                        {!showPassword ? (
                            <FaEyeSlash className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEye className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                </div>

                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[10px] outline-none w-full px-[20px] py-[10px]"
                        value={password2}
                        onFocus={() => setIsFocused({ ...isFocused, input2: true })}
                        onChange={(e) => {
                            setPassword2(e.target.value);
                            if (e.target.value !== '') {
                                setIsFocused({ ...isFocused, input2: true });
                            }
                        }}
                        onBlur={() => setIsFocused({ ...isFocused, input2: false })}
                        placeholder="Şifrəni təkrar daxil edin"
                        required
                    />
                    {isFocused.input2 && password2 && (
                        <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Şifrəni təkrar daxil edin</span>
                    )}
                    <div className="absolute right-[15px] top-[35%]">
                        {!showPassword ? (
                            <FaEyeSlash className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEye className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                        )}
                    </div>
                </div>

                <span className="text-[12px] text-[#787B8E] sm:max-w-[500px] w-[90%] text-left mt-[5px] ml-[10px]">{!isValid ? "Hər iki boşluqdakı şifrə eyni olmalıdır" : ""}</span>

                <button className={`bg-[#000919] text-white py-4 sm:max-w-[500px] w-[90%] rounded-xl mt-[30px] cursor-pointer`} disabled={!isValid}>
                    Təsdiqlə
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
