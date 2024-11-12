"use client"

import React, { useEffect, useState } from 'react'
import swal from "sweetalert"
import "react-phone-number-input/style.css";
import { getUserType } from '@/lib/slices/userSlice';
import Cookies from 'js-cookie';

import { verifyUser, getRefreshToken } from "@/lib/slices/userSlice"
import { CustomButton, CustomInput } from '@/components';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';

const Verify = () => {
    type E164Number = string;
    const { isLoading, isLoggedIn, error, user } = useAppSelector((state) => state.user);
    const { data: token } = useSWR('token', () => localStorage.getItem('token'));
    const [pin, setPin] = useState("");
    const [tin, setTin] = useState("");
    const [website, setWebsite] = useState("");
    const [address, setAddress] = useState("");
    const [mapLocation, setMapLocation] = useState("");
    const [isFocused, setIsFocused] = useState({ pin: false, tin: false, website: false, address: false, mapLocation: false });

    const dispatch = useAppDispatch();


    useEffect(() => {
        if (token) {
            dispatch(getUserType({ Authorization: token }));
        }
    }, [dispatch, token]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (user?.profile?.account_type_id == 1) {
                const verifyData = {
                    pin: String(pin),
                }
                await dispatch(verifyUser({verifyData, Authorization: token, verify_type: "verify-customer"}))
                swal("Uğurlu!", "Profiliniz uğurla təsdiqləndi.","info").then(
                    () => {
                        dispatch(getRefreshToken({Authorization: token})).then(() => {
                            window.location.replace("/")
                        })
                    }
                );
            }
            else if (user?.profile?.account_type_id == 2) {
                const verifyData = {
                    tin: String(tin),
                    address: String(address),
                    map_location: String(address),
                    website: String(website),
                }   
                await dispatch(verifyUser({verifyData, Authorization: token, verify_type: "verify-business"}))
                swal("Uğurlu!", "Profiliniz uğurla təsdiqləndi.","info").then(
                    () => {
                        dispatch(getRefreshToken({Authorization: token})).then(() => {
                            window.location.replace("/")
                        })
                    }
                );
            }
        }
        catch (error) {
            return error
        }
    }

    return (
        <div className="w-[100%] min-h-[100vh] h-[100%] bg-[#EDEFFD] flex items-center justify-center">
            <div className='flex flex-col justify-center items-center bg-[#FFF] sm:max-w-[750px] w-[95%] h-[auto] pb-[50px] mt-[20vh] mb-[10vh] rounded-[10px]'>
                <form className='w-[100%] flex flex-col items-center justify-center' onSubmit={handleVerify}>
                    <h2 className='relative sm:max-w-[500px] w-[90%] mt-[30px] text-[#000919] font-bold sm:text-[24px] text-[18px]'>Hesabızı təsdiq edin</h2>
                    {/* FIN */}
                    {user?.profile?.account_type_id == 1 &&
                        <div className="relative sm:max-w-[500px] w-[90%] mt-[20px]">
                            <CustomInput
                                name='FIN kod'
                                inputType='text'
                                value={pin}
                                isFocus={isFocused}
                                onChange={
                                    (e) => {
                                        setPin(e.target.value);
                                        if (e.target.value !== '') {
                                            setIsFocused({ ...isFocused, pin: true });
                                        }
                                    }
                                }
                                onFocus={
                                    () => setIsFocused({ ...isFocused, pin: true })
                                }
                                onBlur={() => setIsFocused({ ...isFocused, pin: false })}
                                placeholder='FIN daxil edin (Şəxsiyyət vəsiqənizdəki FIN)'
                            />

                        </div>
                    }
                    {user?.profile?.account_type_id == 2 &&
                        <>
                            <div className="relative sm:max-w-[500px] w-[90%] mt-[20px]">
                                <CustomInput
                                    name='Address'
                                    inputType='text'
                                    value={address}
                                    isFocus={isFocused}
                                    onChange={
                                        (e) => {
                                            setAddress(e.target.value);
                                            if (e.target.value !== '') {
                                                setIsFocused({ ...isFocused, address: true });
                                            }
                                        }
                                    }
                                    onFocus={
                                        () => setIsFocused({ ...isFocused, address: true })
                                    }
                                    onBlur={() => setIsFocused({ ...isFocused, tin: false })}
                                    placeholder='Address daxil edin'
                                />

                            </div>
                            <div className="relative sm:max-w-[500px] w-[90%] mt-[20px]">
                                <CustomInput
                                    name='TIN kod (VÖEN)'
                                    inputType='text'
                                    value={tin}
                                    isFocus={isFocused}
                                    onChange={
                                        (e) => {
                                            setTin(e.target.value);
                                            if (e.target.value !== '') {
                                                setIsFocused({ ...isFocused, tin: true });
                                            }
                                        }
                                    }
                                    onFocus={
                                        () => setIsFocused({ ...isFocused, tin: true })
                                    }
                                    onBlur={() => setIsFocused({ ...isFocused, tin: false })}
                                    placeholder='TIN daxil edin (VÖEN)'
                                />

                            </div>
                            <div className="relative sm:max-w-[500px] w-[90%] mt-[20px]">
                                <CustomInput
                                    name='Website linki'
                                    inputType='text'
                                    value={website}
                                    isFocus={isFocused}
                                    onChange={
                                        (e) => {
                                            setWebsite(e.target.value);
                                            if (e.target.value !== '') {
                                                setIsFocused({ ...isFocused, website: true });
                                            }
                                        }
                                    }
                                    onFocus={
                                        () => setIsFocused({ ...isFocused, website: true })
                                    }
                                    onBlur={() => setIsFocused({ ...isFocused, website: false })}
                                    placeholder='Website linki daxil edin'
                                />

                            </div>
                        </>
                    }

                    <CustomButton btnType='submit' title='Təsdiqlə' handleClick={handleVerify} containerStyles='bg-[#000919] text-white rounded-[12px] relative sm:max-w-[500px] w-[90%] mt-[20px]  ' />
                </form>
            </div>
        </div>
    )
}

export default Verify;