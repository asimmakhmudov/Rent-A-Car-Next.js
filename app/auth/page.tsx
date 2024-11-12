"use client"

import React, { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert"
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { getUserType, User } from '@/lib/slices/userSlice';
import Cookies from 'js-cookie';

import { loginUser, signupUser } from "@/lib/slices/authSlice"
import { useAppSelector, useAppDispatch } from '@/lib/hooks';


const Auth = () => {
    type E164Number = string;
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState<E164Number | undefined>("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [accountType, setAccountType] = useState("1");
    const isValid = password === password2 && password.trim() !== "";
    const [selectedIndex, setSelectedIndex] = useState(0);

    const dispatch = useAppDispatch();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // login function
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginUser({ email, password }).then(
            async (response) => {
                const user = (await dispatch(getUserType({ Authorization: response.token })) as { payload: User }).payload
                if (user) {
                    if (user?.profile?.is_verified == false) {
                        window.location.replace("/verify");
                    } else {
                        window.location.replace("/");
                    }
                }
                else {
                    swal("Uğursuz!", `${response.response.data.error}`, "error");
                }
            },
        )
    }

    // Sign up function
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData = {
            email: String(email),
            name: String(name),
            surname: accountType === "1" ? String(surname) : undefined,
            password: String(password),
            phone_number: String(phoneNum),
            account_type: Number(accountType)
        };

        await signupUser(userData).then(
            (response) => {
                if (response) {
                    window.location.reload()
                }
            },
            (error) => {
                swal("Uğursuz!", `${error.response.data.error}`, "error");
            }
        )
    };

    return (
        <div className="w-[100%] min-h-[100vh] h-[100%] bg-[#EDEFFD] flex items-center justify-center">
            <div className='flex flex-col justify-center items-center bg-[#FFF] sm:max-w-[750px] w-[95%] h-[auto] pb-[50px] mt-[20vh] mb-[10vh] rounded-[10px]'>
                <Tab.Group selectedIndex={selectedIndex}>
                    <Tab.List className='bg-[#EDEFFD] w-[100%] h-[100%] rounded-t-[10px]'>
                        <Tab className={`w-[50%] rounded-t-[10px] p-[10px] transition duration-300 ease-in-out outline-none ${selectedIndex === 0 ? 'bg-[#FFF] text-[#000919]' : 'bg-[#EDEFFD] text-[#787B8E]'}`} onClick={() => setSelectedIndex(0)}>Daxil ol</Tab>
                        <Tab className={`w-[50%] rounded-t-[10px] p-[10px] transition duration-300 ease-in-out outline-none ${selectedIndex === 1 ? 'bg-[#FFF] text-[#000919]' : 'bg-[#EDEFFD] text-[#787B8E]'}`} onClick={() => setSelectedIndex(1)}>Qeydiyyatdan keç</Tab>
                    </Tab.List>
                    <Tab.Panels className='w-[100%] h-[100%] p-[20px]'>
                        <Tab.Panel>
                            <form className='w-[100%] flex flex-col items-center justify-center' onSubmit={handleLogin}>

                                {/* MAIL */}
                                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                                    <input
                                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                                        name='Email'
                                        type='email'
                                        value={email}
                                        onChange={
                                            (e) => {
                                                setEmail(e.target.value);
                                            }
                                        }
                                        required
                                    />
                                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Email</span>
                                </div>

                                {/* PASSWORD */}
                                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                                    <input
                                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                                        name='Şifrə'
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={
                                            (e) => {
                                                setPassword(e.target.value);
                                            }
                                        }
                                        required
                                    />
                                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Şifrə</span>
                                    <div className="absolute right-[15px] top-[35%]">
                                        {!showPassword ? (
                                            <FaEyeSlash className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                                        ) : (
                                            <FaEye className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                                        )}
                                    </div>
                                </div>

                                <button className={`bg-[#000919] text-white py-4 sm:max-w-[500px] w-[90%] rounded-xl mt-[30px] cursor-pointer`}>
                                    Daxil ol
                                </button>
                            </form>
                        </Tab.Panel>



                        <Tab.Panel>
                            <form className='w-[100%] flex flex-col items-center justify-center' onSubmit={handleRegister}>

                                <p className='relative flex sm:max-w-[500px] w-[90%] mt-[30px]'>Hesab növünü seçin</p>
                                <div className="relative flex sm:max-w-[500px] w-[90%] mt-[10px]">
                                    <label className={`w-[100%] flex items-center text-[15px] text-[#787B8E] justify-center cursor-pointer rounded-[12px] border-2 bg-white py-2 px-4 hover:bg-gray-50 focus:outline-none transition-all duration-500 ease-in-out ${accountType == "1" && "border-[#000919]"}`}>
                                        <input
                                            type="radio"
                                            name="accountType"
                                            className='mr-[5px] sr-only'
                                            value="1"
                                            checked={accountType === "1"}
                                            onChange={(e) => (
                                                setAccountType("1")
                                            )}
                                            required
                                        />
                                        {accountType == "1" && <span className='mr-[10px]'>✅</span>}
                                        Individual
                                    </label>
                                    <label className={`ml-[10px] w-[100%] flex items-center text-[15px] text-[#787B8E] justify-center cursor-pointer rounded-[12px] border-2 bg-white py-2 px-4 hover:bg-gray-50 focus:outline-none transition-all duration-500 ease-in-out ${accountType == "2" && "border-[#000919]"}`}>
                                        <input
                                            type="radio"
                                            className='mr-[5px] sr-only'
                                            name="accountType"
                                            value="2"
                                            checked={accountType === "2"}
                                            onChange={(e) => (
                                                setAccountType("2")

                                            )}
                                            required
                                        />
                                        {accountType == "2" && <span className='mr-[10px]'>✅</span>}
                                        Business
                                    </label>
                                </div>

                                {/* NAME */}
                                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                                    <input
                                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                                        name='Adı'
                                        type='text'
                                        value={name}
                                        onChange={
                                            (e) => {
                                                setName(e.target.value);
                                            }
                                        }
                                        required
                                    />
                                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Adı</span>
                                </div>

                                {/* SURNAME */}
                                {accountType == "1" &&
                                    <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                                        <input
                                            className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                                            name='Soyadı'
                                            type='text'
                                            value={surname}

                                            onChange={
                                                (e) => {
                                                    setSurname(e.target.value);
                                                }
                                            }
                                            required
                                        />
                                        <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Soyadı</span>
                                    </div>
                                }

                                {/* MAIL */}
                                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                                    <input
                                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                                        name='Email'
                                        type='email'
                                        value={email}
                                        onChange={
                                            (e) => {
                                                setEmail(e.target.value);
                                            }
                                        }
                                        required
                                    />
                                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Email</span>
                                </div>


                                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px] border border-1 border-[#B2BCCA] text-[14px] rounded-[10px] outline-noneborder border-1 outline-none ">
                                    <PhoneInput
                                        international
                                        defaultCountry="AZ"
                                        value={phoneNum}
                                        onChange={(value: E164Number | undefined) => {
                                            if (value !== undefined) {
                                                setPhoneNum(value);
                                            }
                                        }}
                                        id="phone"
                                        name="phone"
                                        className="px-[20px] py-[10px]"
                                        required
                                    />
                                </div>


                                {/* PASSWORD 1 */}
                                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                                    <input
                                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                                        name='Şifrə'
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={
                                            (e) => {
                                                setPassword(e.target.value);
                                            }
                                        }
                                        required
                                    />
                                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Şifrə</span>
                                    <div className="absolute right-[15px] top-[35%]">
                                        {!showPassword ? (
                                            <FaEyeSlash className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                                        ) : (
                                            <FaEye className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                                        )}
                                    </div>
                                </div>


                                {/* PASSWORD 2 */}
                                <div className="relative sm:max-w-[500px] w-[90%] mt-[30px]">
                                    <input
                                        className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                                        name='Təkrar şifrə'
                                        type={showPassword ? "text" : "password"}
                                        value={password2}
                                        onChange={
                                            (e) => {
                                                setPassword2(e.target.value);
                                            }
                                        }
                                        required
                                    />
                                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Təkrar Şifrə</span>
                                    <div className="absolute right-[15px] top-[35%]">
                                        {!showPassword ? (
                                            <FaEyeSlash className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                                        ) : (
                                            <FaEye className="cursor-pointer text-[#787B8E]" onClick={togglePasswordVisibility} />
                                        )}
                                    </div>
                                </div>

                                <span className="text-[12px] text-[#007bff] sm:max-w-[500px] w-[90%] text-left mt-[5px] ml-[10px]">{!isValid ? "Hər iki boşluqdakı şifrə eyni olmalıdır" : ""}</span>

                                <button className={`bg-[#000919] text-white py-4 sm:max-w-[500px] w-[90%] rounded-xl mt-[30px] cursor-pointer`}>
                                    Qeydiyyatdan keç
                                </button>
                            </form>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}

export default Auth;