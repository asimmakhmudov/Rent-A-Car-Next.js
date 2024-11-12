"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Tab } from '@headlessui/react'
import { LuChevronLeftSquare, LuImagePlus, LuChevronRightSquare, LuCalendarDays, LuPlusSquare, LuClock3, LuCar, LuUserCircle2, LuMenu, LuArrowLeft, LuPencilLine, LuHistory, LuAlertOctagon, LuTicket, LuClipboardCopy, LuCalendarPlus, LuInfo } from "react-icons/lu";
import { FaCar } from "react-icons/fa6";
import CustomTable from '@/components/CustomTable';
import Image from 'next/image';
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  CityFilter, ColorFilter, BrandFilter, CustomButton, ModelFilter, CustomPopup, Filters
} from '@/components';
import { BrandProps, CityProps, ColorProps, ModelProps } from '@/types';
import { getAllModels, getBrands, getCities, getColor, getModels } from '@/lib/slices/filterSlice';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getUserType, getUser, putUser, getProfilePhoto, postProfilePhoto } from '@/lib/slices/userSlice';
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import { deleteCar, deleteCarSlots, getCarData_by_ownerid, getCarSlots, postCarData, postCarPhotos, postCarSlots } from '@/lib/slices/carSlice';
import { daysOfWeek, monthsInAzerbaijani, mycarTitles, reserveTitles, weekdaysInAzerbaijani } from '@/constants';
import { formatDate, formatTime } from '@/utils/functions';

const Dashoard = () => {
  const authToken = Cookies.get('token');
  const dispatch = useAppDispatch();
  const reserveData = true;
  type E164Number = string;
  const [addcarPopup, setaddcarPopup] = useState(false);
  const [editcarPopup, seteditcarPopup] = useState<{ isOpen: boolean; car: any }>({ isOpen: false, car: null });
  const [slotPopup, setslotPopup] = useState<{ isOpen: boolean; car: any }>({ isOpen: false, car: null });
  const { isLoading, user, images } = useAppSelector((state) => state.user);
  const { mycars, slots } = useAppSelector((state) => state.car);
  const { colors, cities, brands, models, allmodels } = useAppSelector((state) => state.filter);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openbar, setOpenbar] = useState(false)
  const [name, setName] = useState("" || user?.profile?.name);
  const [surname, setSurname] = useState("" || user?.profile?.surname);
  const [email, setEmail] = useState(user?.profile?.email);
  const [pin, setPin] = useState(user?.profile?.pin);
  const [tin, setTin] = useState(user?.profile?.tin);
  const [website, setWebsite] = useState("" || user?.profile?.website);
  const [address, setAddress] = useState("" || user?.profile?.address);
  const [mapLocation, setMapLocation] = useState("" || user?.profile?.map_location);
  const [phoneNum, setPhoneNum] = useState<E164Number | any>("" || user?.profile?.phone_number);
  const [promocode, setPromocode] = useState("yourpromokod")
  const [copiedpromo, setCopiedPromo] = useState(false);
  const [carInfo, setcarInfo] = useState("")
  const [carVin, setcarVin] = useState("")
  const [carYear, setcarYear] = useState("")
  const [carPrice, setcarPrice] = useState("")
  const [carPlate, setCarPlate] = useState("")
  const [carPlateValues, setCarPlateValues] = useState({
    part1: '',
    part2: '',
    part3: ''
  });
  const part1Ref = useRef<HTMLInputElement>(null);
  const part2Ref = useRef<HTMLInputElement>(null);
  const part3Ref = useRef<HTMLInputElement>(null);
  const [addedImages, setAddedImages] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<any>(images.image);
  const [selectedCity, setSelectedCity] = useState<CityProps | "">("");
  const [selectedColor, setSelectedColor] = useState<ColorProps | "">("");
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | "">("" as BrandProps);
  const [selectedModel, setSelectedModel] = useState<ModelProps | "">("" as ModelProps);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [timeSlots, setTimeSlots] = useState<{ time: string; car_id: string | null; date: string }[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState<{ time: string; car_id: string | null }>({ time: '', car_id: null });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    dispatch(getColor())
    dispatch(getCities())
    dispatch(getBrands())
    dispatch(getAllModels())
    dispatch(getUserType({ Authorization: authToken }))
    if ((selectedBrand as BrandProps)?.id) {
      dispatch(getModels({ id: (selectedBrand as BrandProps)?.id }))
    }
    dispatch(getProfilePhoto({ Authorization: authToken }))
  }, [dispatch, (selectedBrand as BrandProps)?.id]);


  useEffect(() => {
    if (!isLoading && user && user?.profile?.account_type_id && authToken) {
      const { account_type_id, user_id } = user.profile;
      if (account_type_id === 2) {
        dispatch(getCarData_by_ownerid({ Authorization: authToken, car_owner_id: user.profile?.user_id }))
        dispatch(getUser({ account_type: "businesses", Authorization: authToken, user_id }));

      } else if (account_type_id === 1) {
        dispatch(getCarData_by_ownerid({ Authorization: authToken, car_owner_id: user.profile?.user_id }))
        dispatch(getUser({ account_type: "customers", Authorization: authToken, user_id }));

      }
    }
  }, [user?.profile?.account_type_id]);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (profilePhoto && profilePhoto instanceof Blob) {
      objectUrl = URL.createObjectURL(profilePhoto);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profilePhoto]);

  const validateStep1 = () => {
    if (!selectedBrand || !selectedModel || !selectedCity || !selectedColor) return false;
    if (!carVin || !carYear || !carPrice) return false;
    if (!carPlateValues.part1 || !carPlateValues.part2 || !carPlateValues.part3) return false;
    if (!carInfo) return false;
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Show some error message or highlight invalid fields
      alert("Please fill in all required fields before proceeding.");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(postProfilePhoto({ file: profilePhoto, Authorization: authToken }))
      const { user_id } = user.profile;
      if (user?.profile?.account_type_id == 1) {
        const updatedData = {
          name: String(name || user?.profile?.name),
          phone_number: String(phoneNum || user?.profile?.phone_number),
          surname: String(surname || user?.profile?.surname),
          user_id: user?.profile?.user_id,
        };

        dispatch(putUser({ updatedData, account_type: "customers", Authorization: authToken, user_id }));
      }
      else if (user?.profile?.account_type_id == 2) {
        const updatedData = {
          name: String(name || user?.profile?.name),
          phone_number: String(phoneNum || user?.profile?.phone_number),
          address: String(address || user?.profile?.address),
          mapLocation: String(mapLocation || user?.profile?.map_location),
          website: String(website || user?.profile?.website),
          user_id: user?.profile?.user_id,
        };
        dispatch(putUser({ updatedData, account_type: "businesses", Authorization: authToken, user_id }));
      }
    } catch (error) {
      swal("Uğursuz!", "Update zamanı xəta baş verdi", "error");
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
          if (e.target) {
            setAddedImages(prevImages => [...prevImages, file]);
          }
        };

        reader.onerror = (error) => {
          return error;
        };
      }
    }
  };

  // const handleFileProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;

  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       if (e.target) {
  //         setProfilePhoto(file);
  //       }
  //     };

  //     reader.onerror = (error) => {
  //       return error;
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleFileProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      try {
        // Ensure that `setProfilePhoto` can handle the file
        setProfilePhoto(file);
      } catch (error) {
        console.error("Error setting profile photo:", error);
        // Handle error (show message to user, etc.)
      }
    }
  };

  const removeImage = (index: number) => {
    setAddedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(promocode);
    setCopiedPromo(true);
    setTimeout(() => {
      setCopiedPromo(false);
    }, 1500);
  };

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user_id } = user.profile;
      const carData = {
        car_owner_id: user_id,
        city_id: (selectedCity as CityProps)?.id ?? "",
        color_id: (selectedColor as ColorProps)?.id || "",
        brand_id: (selectedBrand as BrandProps)?.id || "",
        model_id: (selectedModel as ModelProps)?.id || "",
        car_number: carPlate.split('-').join(''),
        description: carInfo,
        price: Number(carPrice),
        vin: carVin,
        year: carYear,
      };
      dispatch(postCarData({ carData, Authorization: authToken })).then(
        (response: any) => {
          if (response?.payload?.car_id) {
            const car_id = response?.payload.car_id
            dispatch(postCarPhotos({ images: addedImages, Authorization: authToken, car_owner_id: user_id, car_id: car_id })).then(() => {
              setaddcarPopup(false)
            })
          }
        }
      );
    } catch (error) {
      swal("Uğursuz!", "Xəta baş verdi", "error");
      return error;
    }
  }

  const handleRemoveCar = (car_id: any) => (e: React.MouseEvent) => {
    e.preventDefault();
    swal({
      title: "Əminsiniz?",
      text: "Bu əməliyyatı zamanı məlumatların geri qaytarılması mümkün deyil!",
      icon: "warning",
      buttons: [
        'İmtina et',
        'Avtomobili Sil'
      ],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {
        dispatch(deleteCar({ Authorization: authToken, car_id }))
          .then(() => (
            window.location.reload()
          ))
      }
    })
  };

  const handleChangeCarPlate = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: 'part1' | 'part2' | 'part3',
    maxLength: number,
    regex: RegExp
  ) => {
    const target = e.target as HTMLInputElement;
    const newValue = target.value;
    if (newValue.length <= maxLength && regex.test(newValue)) {
      setCarPlateValues(prev => {
        const updatedValues = { ...prev, [part]: newValue };
        const combinedPlate = `${updatedValues.part1}-${updatedValues.part2.toUpperCase()}-${updatedValues.part3}`;
        setCarPlate(combinedPlate);
        if (newValue.length === maxLength) {
          switch (part) {
            case 'part1':
              part2Ref.current?.focus();
              break;
            case 'part2':
              part3Ref.current?.focus();
              break;
            default:
              break;
          }
        }

        return updatedValues;
      });
    }

    const inputEvent = e.nativeEvent as InputEvent;
    if (newValue.length === 0 && inputEvent.inputType === 'deleteContentBackward') {
      switch (part) {
        case 'part2':
          part1Ref.current?.focus();
          break;
        case 'part3':
          part2Ref.current?.focus();
          break;
        default:
          break;
      }
    }
  };



  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };




  const handleAddTimeSlot = () => {
    if (newTimeSlot.time && selectedDate) {
      const slotWithDate = {
        time: newTimeSlot.time,
        date: selectedDate.toISOString().split('T')[0],
        car_id: newTimeSlot.car_id
      };
      setTimeSlots([...timeSlots, slotWithDate]);
      setNewTimeSlot({ time: '', car_id: newTimeSlot.car_id });
    }
  };
  const handleGetSlots = (car_id: number) => {
    dispatch(getCarSlots({ Authorization: authToken, car_id: car_id }))
  }
  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };
  const addAvailableSlot = () => {
    if (timeSlots.length > 0) {
      const data = {
        car_id: newTimeSlot.car_id,
        slots: timeSlots.map(slot => ({
          date: slot.date,
          start_time: slot.time,
        })),
      };
      dispatch(postCarSlots({ carSlot: data, Authorization: authToken }))
        .then(() => setslotPopup({ isOpen: false, car: slotPopup.car }));

      setTimeSlots([]);
    }
  };
  const deleteAvailableSlot = (car_id: number) => {
    dispatch(deleteCarSlots({ Authorization: authToken, car_id: car_id })).then(
      () => setslotPopup({ isOpen: false, car: slotPopup.car })
    )
  }



  return (
    <div className='flex flex-col mt-2 padding-x padding-y max-width min-h-[100vh]'>
      <div className='w-[100%] h-[8vh] mt-[12vh] bg-[#000919] rounded-[12px] flex justify-between items-center' >
        <h1 className='text-[#FFF] ml-[20px] font-extrabold'>Dashboard</h1>
      </div>
      <div className='flex max-sm:flex-col justify-center items-start w-[100%] h-[auto] sm:mt-[4vh] mt-[10px] mb-[5vh] '>

        <Tab.Group selectedIndex={selectedIndex}>
          <Tab.List className={`flex sm:flex-col max-sm:overflow-x-auto bg-[#EDEFFD] h-[100%] rounded-[12px] py-[10px] max-sm:mb-[15px] transition-width duration-300 max-sm:w-[100%] ease-in-out ${openbar ? "sm:w-[180px] items-end" : "sm:w-[80px] items-center"}`}>
            <button className="flex items-center w-[auto] h-[auto] rounded-[10px] p-[10px] m-[5px] text-[#000919] max-sm:hidden" onClick={() => { setOpenbar(!openbar) }}>{openbar ? <LuArrowLeft className='w-[20px] h-[20px]' /> : <LuMenu className='w-[20px] h-[20px]' />}</button>
            <Tab className={`flex items-center h-[50px] rounded-[10px] p-[10px] m-[5px] transition-width duration-300 ease-in-out ${openbar ? "w-[150px] my-[5px]" : "w-[70px] justify-center"} ${selectedIndex === 0 ? 'bg-[#000919] text-[#FFF]' : 'bg-[#FFF] text-[#000919]'}`} onClick={() => setSelectedIndex(0)}><LuCalendarDays className='w-[20px] h-[20px]' /> {openbar && <p className="ml-[10px] text-[12px]">Reserv Təqvimi</p>}</Tab>
            <Tab as="div" className={`flex items-center h-[50px] cursor-pointer rounded-[10px] p-[10px] m-[5px] transition-width duration-300 ease-in-out ${openbar ? "w-[150px] my-[5px]" : "w-[70px] justify-center"} ${selectedIndex === 1 ? 'bg-[#000919] text-[#FFF]' : 'bg-[#FFF] text-[#000919]'}`} onClick={() => setSelectedIndex(1)}><LuCar className='w-[20px] h-[20px]' /> {openbar && <p className="ml-[10px] text-[12px]">Avtomobillərim</p>}</Tab>
            {user?.profile?.account_type_id == 1
              && (
                <>
                  <Tab as="div" className={`flex items-center cursor-pointer h-[50px] rounded-[10px] p-[10px] m-[5px] transition-width duration-300 ease-in-out ${openbar ? "w-[150px] my-[5px]" : "w-[70px] justify-center"} ${selectedIndex === 3 ? 'bg-[#000919] text-[#FFF]' : 'bg-[#FFF] text-[#000919]'}`} onClick={() => setSelectedIndex(3)}><LuHistory className='w-[20px] h-[20px]' /> {openbar && <p className="ml-[10px] text-[12px]">Tarixçə</p>}</Tab>
                  <Tab as="div" className={`flex items-center cursor-pointer h-[50px] rounded-[10px] p-[10px] m-[5px] transition-width duration-300 ease-in-out ${openbar ? "w-[150px] my-[5px]" : "w-[70px] justify-center"} ${selectedIndex === 4 ? 'bg-[#000919] text-[#FFF]' : 'bg-[#FFF] text-[#000919]'}`} onClick={() => setSelectedIndex(4)}><LuAlertOctagon className='w-[20px] h-[20px]' /> {openbar && <p className="ml-[10px] text-[12px]">Şikayətlərim</p>}</Tab>
                  <Tab as="div" className={`flex items-center cursor-pointer h-[50px] rounded-[10px] p-[10px] m-[5px] transition-width duration-300 ease-in-out ${openbar ? "w-[150px] my-[5px]" : "w-[70px] justify-center"} ${selectedIndex === 5 ? 'bg-[#000919] text-[#FFF]' : 'bg-[#FFF] text-[#000919]'}`} onClick={() => setSelectedIndex(5)}><LuTicket className='w-[20px] h-[20px]' /> {openbar && <p className="ml-[10px] text-[12px]">Promokodlar</p>}</Tab>
                </>
              )
            }
            <Tab className={`flex items-center h-[50px] rounded-[10px] p-[10px] m-[5px] transition-width duration-300 ease-in-out ${openbar ? "w-[150px] my-[5px]" : "w-[70px] justify-center"} ${selectedIndex === 2 ? 'bg-[#000919] text-[#FFF]' : 'bg-[#FFF] text-[#000919]'}`} onClick={() => setSelectedIndex(2)}><LuUserCircle2 className='w-[20px] h-[20px]' /> {openbar && <p className="ml-[10px] text-[12px]">Şəxsi Profil</p>}</Tab>
          </Tab.List>

          <Tab.Panels className='w-[100%] h-[100%] sm:pl-[20px] overflow-x-auto overflow-y-auto'>
            {/* Reserv Təqvimi */}
            <Tab.Panel>
              <CustomTable title='Reserv Təqvimi'
                tbodyContent={
                  <>
                    {reserveData ?
                      <>
                        <thead>
                          <tr className="border border-gray-200 text-xs leading-4 text-[#000919] uppercase tracking-wider">
                            {reserveTitles?.map((item) => (
                              <th className="px-6 py-3 text-left font-bolder">
                                {item}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <img
                                    className="rounded-full h-[50px] w-[50px] object-cover"
                                    src="/carshablon.jpg"
                                    width={100}
                                    height={100}
                                    alt=""
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                Tural
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                Salmanov
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <a href='#' className="text-indigo-600 text-sm hover:text-indigo-900 focus:outline-none focus:underline">
                                050 999 99 99
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <a href="#"
                                className="text-indigo-600 text-sm hover:text-indigo-900 focus:outline-none focus:underline" >
                                tural@gmail.com
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                bmw z4
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                17 Mart
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                19:00
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                              <div className="text-sm leading-5 text-green-500 font-extrabold">
                                30 manat
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap text-right border border-gray-200 text-sm leading-5 font-medium ">
                              <span className="px-[10px] py-2 text-xs flex justify-center items-center font-semibold rounded-[12px] bg-green-100 text-green-800">
                                Bitdi
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </>
                      :
                      <>
                        <div className='flex flex-col justify-center items-center'>
                          <div className="text-[#000919] mt-[30px] text-center">
                            <h2 className="font-bold sm:text-[24px] text-[18px]">Hazırda reserv edilən avtomobil yoxdur</h2>
                            <p className="font-semibold text-[12px]">Sizin avtomobillər reserv edildikdə burada qeyd olunacaqdır</p>
                          </div>
                          <img
                            src="/dashreserve.png"
                            className="sm:h-[70vh] sm:w-[70vw] h-[100%] w-[95%] object-contain"
                            width={500}
                            height={500}
                            alt=""
                          />
                        </div>
                      </>
                    }
                  </>
                }
              />
            </Tab.Panel>

            {/* Avtomobillərim */}
            <Tab.Panel>
              <CustomTable
                title='Avtomobillərim'
                theadContent={
                  <CustomButton
                    title='+ Yeni avtomobil'
                    btnType="button"
                    containerStyles='border border-[#000919] text-[#000919] rounded-[12px] mx-2 sm:text-[16px] text-[10px]'
                    handleClick={() => setaddcarPopup(true)}
                  />
                }
                tbodyContent={
                  <>
                    {
                      mycars?.cars?.length > 0 ? (
                        <React.Fragment>
                          <thead>
                            <tr className="border border-gray-200 text-xs leading-4 text-[#000919] uppercase tracking-wider">
                              {mycarTitles?.map((item) => (
                                <th className="px-6 py-3 text-left font-bolder">
                                  {item}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          {mycars?.cars.map((element?: any) => (
                            <tbody className='w-[100%]'>
                              <tr key={element.id}>
                                {/* <td className="whitespace-no-wrap border border-gray-200">
                                  <div className="flex items-center justify-center w-[100%] sm:px-3 px-10 py-4">
                                    <div className="flex-shrink-0">
                                      <img
                                        className="rounded-full h-[40px] w-[40px] object-cover"
                                        src={element?.car_image}
                                        alt="car image"
                                      />
                                    </div>
                                  </div>
                                </td> */}

                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                  <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                    {brands?.car_brands?.find((brand: any) => brand.id === element?.brand_id)?.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                  <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                    {
                                      allmodels?.car_brand_models?.find((model: any) => model.id === element?.model_id)?.name
                                    }
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                  <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                    {element?.year}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                  <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                    {element?.car_number}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                  <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                    {colors?.car_colors?.find((color: any) => color.id === element?.color_id)?.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                  <div className="text-sm leading-5 text-green-500 font-extrabold">
                                    {element?.price} AZN
                                  </div>
                                </td>

                                {element?.is_verified == true ? (
                                  <td className="px-3 py-3 whitespace-no-wrap border border-gray-200 text-sm leading-5 font-medium">
                                    <button className="px-[10px] py-2 text-xs sm:text-[12px] flex justify-center items-center font-semibold rounded-[12px] bg-[transparent] border border-[#424349] text-[#424349] w-[100%]"
                                      onClick={() => {
                                        handleGetSlots(element.id)
                                        setslotPopup({ isOpen: true, car: element })
                                      }}>
                                      <LuCalendarPlus className='w-[20px] h-[20px] sm:mr-[10px]' title='reserve təqvimi' /> <span className='max-md:hidden'>Rezerv təqvimi</span>
                                    </button>
                                  </td>
                                ) :
                                  (
                                    <td className="px-3 py-3 whitespace-no-wrap border border-gray-200 text-sm leading-5 font-medium">
                                      <button className="px-[10px] py-2 text-xs sm:text-[12px] flex justify-center items-center font-semibold rounded-[12px] bg-[transparent] border border-[#424349] text-[#424349] w-[100%]">
                                        <LuInfo className='w-[20px] h-[20px] sm:mr-[10px]' title='not verified' />  <span className='max-md:hidden'>Not verified</span>
                                      </button>
                                    </td>
                                  )
                                }
                                <td className="px-3 py-3 whitespace-no-wrap border border-gray-200 text-sm leading-5 font-medium">
                                  <button
                                    className="px-[10px] py-2 text-xs sm:text-[12px] flex justify-center items-center font-semibold rounded-[12px] bg-[transparent] border border-[#424349] text-[#424349] w-[100%]"
                                    onClick={() => seteditcarPopup({ isOpen: true, car: element })}>
                                    <LuPencilLine className='w-[20px] h-[20px] sm:mr-[10px]' /> <span className='max-md:hidden'>Edit</span>
                                  </button>
                                </td>
                                <td className="px-3 py-4 whitespace-no-wrap text-right border border-gray-200 text-sm leading-5 font-medium">
                                  <button className="px-[10px] py-2 text-[24px] flex justify-center items-center font-semibold rounded-[12px] bg-red-500 text-[#fff]" onClick={handleRemoveCar({ car_id: element?.id })}>
                                    &times;
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </React.Fragment>
                      ) : (
                        <tbody>
                          <tr>
                            <td className='flex flex-col justify-center items-center'>
                              <div className="text-[#000919] mt-[30px] text-center">
                                <h2 className="font-bold sm:text-[24px] text-[18px]">Hazırda avtomobiliniz yoxdur</h2>
                                <p className="font-semibold text-[12px]">Avtomobillərini platformamıza əlavə et, əlavə gəlir qazan 🤑</p>
                              </div>
                              <img
                                src="/dashauto.png"
                                className="sm:h-[70vh] sm:w-[70vw] h-[100%] w-[95%] object-contain"
                                width={500}
                                height={500}
                                alt=""
                              />
                            </td>
                          </tr>
                        </tbody>
                      )
                    }

                  </>
                }
              />
            </Tab.Panel>

            {/* Şəxsi Profil */}
            <Tab.Panel>
              <CustomTable
                title='Şəxsi Profil'
                tbodyContent={
                  <div className='flex flex-col justify-start items-start'>
                    <form className='grid grid-cols-2 gap-6 mx-[30px] my-[20px] w-[80%]' onSubmit={handleUpdateUser}>

                      {/* Profile Photo */}
                      <div className='relative col-span-4 mb-6 w-[auto]'>
                        <div className='w-[100px] relative'>
                          <h2 className='font-extrabold text-[#000919] text-[15px]'>Profil Foto</h2>
                          <img
                            className="rounded-full h-[100px] w-[100px] mt-2 object-cover"
                            src={profilePhoto && profilePhoto instanceof Blob
                              ? URL?.createObjectURL(profilePhoto)
                              : images.image}
                            alt="Profile photo"
                          />
                          <label htmlFor="fileInput" className='right-[-6px] cursor-pointer bottom-[8px] border border-[#000919] absolute bg-[#EDEFFD] p-[5px] rounded-full'>
                            <LuImagePlus />
                          </label>
                          <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileProfile}
                          />
                        </div>
                      </div>

                      {/* NAME */}
                      <div className="relative col-span-4 md:col-span-1">
                        <input
                          className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                          type='text'
                          defaultValue={name || user?.profile?.name}
                          value={name}
                          onChange={(e) => { setName(e.target.value) }}
                        />
                        <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Adı</span>
                      </div>

                      {/* SURNAME */}
                      {user?.profile?.account_type_id == 1 && (
                        <div className="relative col-span-4 md:col-span-1">
                          <input
                            className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                            type='text'
                            defaultValue={surname || user?.profile?.surname}
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                          />
                          <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Soyadı</span>
                        </div>
                      )}

                      {/* EMAIL */}
                      <div className="relative col-span-4 md:col-span-1 text-[#787B8E]">
                        <input
                          className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                          type='email'
                          defaultValue={email || user?.profile?.email}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={true}
                        />
                        <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Email</span>
                      </div>

                      {/* Address */}
                      {user?.profile?.account_type_id == 2 && (
                        <div className="relative col-span-4 md:col-span-1">
                          <input
                            className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                            type='text'
                            defaultValue={address || user?.profile?.address}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Ünvan</span>
                        </div>
                      )}

                      {/* Website */}
                      {user?.profile?.account_type_id == 2 && (
                        <div className="relative col-span-4 md:col-span-1">
                          <input
                            className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                            type='text'
                            defaultValue={website || user?.profile?.website}
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                          />
                          <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Websayt</span>
                        </div>
                      )}

                      {/* Location */}
                      {user?.profile?.account_type_id == 2 && (
                        <div className="relative col-span-4 md:col-span-1">
                          <input
                            className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                            type='text'
                            defaultValue={mapLocation || user?.profile?.map_location}
                            value={mapLocation}
                            onChange={(e) => setMapLocation(e.target.value)}
                            disabled={true}
                          />
                          <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Location</span>
                        </div>
                      )}

                      {/* TIN */}
                      {user?.profile?.account_type_id == 2 && (
                        <div className="relative col-span-4 md:col-span-1 text-[#787B8E]">
                          <input
                            className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                            name='TIN'
                            type='text'
                            value={tin || user?.profile?.tin}
                            onChange={(e) => setTin(e.target.value)}
                            disabled={true}
                          />
                          <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">TIN</span>
                        </div>
                      )}

                      {/* FIN */}
                      {user?.profile?.account_type_id == 1 && (
                        <div className="relative col-span-4 md:col-span-1 text-[#787B8E]">
                          <input
                            className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                            name='FIN kod'
                            type='text'
                            value={pin || user?.profile?.pin}
                            onChange={(e) => setPin(e.target.value)}
                            disabled
                          />
                          <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">FIN</span>
                        </div>
                      )}

                      {/* PHONE */}
                      <div className="relative col-span-4 md:col-span-1">
                        <label htmlFor='phone' className="border border-1 border-[#B2BCCA] text-[14px] rounded-[10px] outline-none flex items-center w-full">
                          <PhoneInput
                            defaultCountry="AZ"
                            initialValueFormat="national"
                            defaultValue={phoneNum || user?.profile?.phone_number}
                            value={phoneNum || user?.profile?.phone_number}
                            onChange={(value) => setPhoneNum(value)}
                            id="phone"
                            name="phone"
                            keyboardType="phone-pad"
                            className="px-[20px] py-[10px] outline-none w-full"
                          />
                        </label>
                        <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Phone</span>
                      </div>

                      {/* Save Button */}
                      <div className="relative col-span-4">
                        <CustomButton title='Yadda Saxla' btnType="submit" containerStyles='bg-[#000919] text-white rounded-[12px] w-[100%]' />
                      </div>
                    </form>
                  </div>
                }
              />
            </Tab.Panel>

            {/* Tarixçə */}
            {user?.profile?.account_type_id == 1 && (
              <Tab.Panel>
                <CustomTable title='Tarixçə'
                  tbodyContent={
                    <>
                      {reserveData ?
                        <>
                          <tbody>
                            <tr>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                  №123456
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="text-sm leading-5 text-green-500 font-extrabold">
                                  30 manat
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                  17 Mart
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                  19:00
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                  Tural
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                  Salmanov
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                  bmw
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                                <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                                  z4
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap text-right border border-gray-200 text-sm leading-5 font-medium ">
                                <span className="px-[10px] py-2 text-xs flex justify-center items-center font-semibold rounded-[12px] bg-red-600 text-white">
                                  Ləğv Edildi
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </>
                        :
                        <>
                          <div className='flex flex-col justify-center items-center'>
                            <div className="text-[#000919] mt-[30px] text-center">
                              <h2 className="font-bold sm:text-[24px] text-[18px]">Hazırda reserv edilən avtomobil yoxdur</h2>
                              <p className="font-semibold text-[12px]">Sizin avtomobillər reserv edildikdə burada qeyd olunacaqdır</p>
                            </div>
                            <img
                              src="/dashreserve.png"
                              className="sm:h-[70vh] sm:w-[70vw] h-[100%] w-[95%] object-contain"
                              width={500}
                              height={500}
                              alt=""
                            />
                          </div>
                        </>
                      }
                    </>
                  } />
              </Tab.Panel>
            )}

            {/* Şikayətlər */}
            <Tab.Panel>
              <CustomTable title='Şikayətlər' tbodyContent={
                <>
                  {reserveData ?
                    <>
                      <tbody>
                        <tr>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                              №123456
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                              Tural
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                              Salmanov
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                              17 Mart
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                              19:00
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                              bmw
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="sm:text-[14px] text-[12px] leading-5 text-gray-900">
                              z4
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border border-gray-200">
                            <div className="text-sm leading-5 text-green-500 font-extrabold">
                              30 manat
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap text-right border border-gray-200 text-sm leading-5 font-medium ">
                            <span className="px-[10px] py-2 text-xs flex justify-center items-center font-semibold rounded-[12px] bg-red-600 text-white">
                              Rədd Edildi
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </>
                    :
                    <>
                      <div className='flex flex-col justify-center items-center'>
                        <div className="text-[#000919] mt-[30px] text-center">
                          <h2 className="font-bold sm:text-[24px] text-[18px]">Hazırda reserv edilən avtomobil yoxdur</h2>
                          <p className="font-semibold text-[12px]">Sizin avtomobillər reserv edildikdə burada qeyd olunacaqdır</p>
                        </div>
                        <img
                          src="/dashreserve.png"
                          className="sm:h-[70vh] sm:w-[70vw] h-[100%] w-[95%] object-contain"
                          width={500}
                          height={500}
                          alt=""
                        />
                      </div>
                    </>
                  }
                </>
              }
              />
            </Tab.Panel>

            {/* Promokod */}
            <Tab.Panel>
              <CustomTable title='Promokod' tbodyContent={
                <div>
                  <div className="flex items-center sm:mx-6 mx-2 my-4 whitespace-no-wrap font-extrabold text-[14px]">
                    <p className="mr-4 text-[green] font-bold py-2">+100AZN</p>
                    <p className="mr-4 border border-[#000919] font-bold py-2 px-4 rounded-[8px] text-[#000919]">{promocode}</p>
                    <button
                      className={`bg-[#000919] text-white font-bold py-2 px-4 rounded-[8px] focus:outline-none focus:shadow-outline ${copiedpromo ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      onClick={handleCopyClick}
                      disabled={copiedpromo}
                    >
                      {copiedpromo ? "Copied" : <LuClipboardCopy className="h-5 w-5" />}
                    </button>
                  </div>

                </div>
              } />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>


      {/* Add car popup */}
      <CustomPopup isOpen={addcarPopup} closeModal={() => setaddcarPopup(false)}
        popupContent={
          <form className='flex flex-col w-full h-full pt-8 pb-4'>
            <h1 className='font-bold text-2xl text-[#000919] w-[90%] mx-auto max-sm:text-center'>Avtomobil Məlumatları</h1>
            <div className='sm:w-[90%] w-[100%] h-full mx-auto mt-8'>
              {currentStep === 1 && (
                <form className='grid grid-cols-2 grid-rows-2 gap-4'>
                  <div className='w-100% max-sm:flex-col flex col-span-4 row-span-2'>
                    <BrandFilter options={brands?.car_brands} setSelectedBrand={setSelectedBrand} selectedBrand={selectedBrand} setSelectedModel={setSelectedModel} />
                    <ModelFilter options={models?.car_brand_models} setSelectedModel={setSelectedModel} selectedModel={selectedModel} selectedBrand={selectedBrand} />
                    <CityFilter options={cities?.cities} setSelectedCity={setSelectedCity} selectedCity={selectedCity} />
                    <ColorFilter title="Rəng" options={colors?.car_colors} setSelectedColor={setSelectedColor} selectedColor={selectedColor} />
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <input
                      className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                      type='text'
                      value={carVin}
                      onChange={(e) => setcarVin((e.target.value).toUpperCase())}
                      required
                    />
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">VIN</span>
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <input
                      className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                      type='text'
                      value={carYear}
                      maxLength={4}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && !(value.startsWith('0')) && value !== "0") {
                          setcarYear((value).toUpperCase())
                        }
                      }}
                      required
                    />
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">İL</span>
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <input
                      className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                      type='text'
                      value={carPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && !(value.startsWith('0')) && value !== "0") {
                          setcarPrice(value);
                        }
                      }}
                      required
                    />
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Qiymət</span>
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <div className='platebg text-[14px] outline-none max-w-[300px] w-[100%] px-[40px] py-[10px] relative flex justify-center items-center'>
                      <input
                        type="text"
                        value={carPlateValues.part1}
                        onChange={(e) => handleChangeCarPlate(e, 'part1', 2, /^[0-9]*$/)}
                        className='ml-[10px] bg-transparent border border-1 w-[50px] outline-none text-center'
                        required
                        maxLength={2}
                        ref={part1Ref}
                      />
                      <span className='mx-[10px]'>-</span>
                      <input
                        type="text"
                        value={carPlateValues.part2}
                        onChange={(e) => handleChangeCarPlate(e, 'part2', 2, /^[A-Za-z]*$/)}
                        className='bg-transparent border border-1 w-[50px] outline-none text-center uppercase'
                        required
                        maxLength={2}
                        ref={part2Ref}
                      />
                      <span className='mx-[10px]'>-</span>
                      <input
                        type="text"
                        value={carPlateValues.part3}
                        onChange={(e) => handleChangeCarPlate(e, 'part3', 3, /^[0-9]*$/)}
                        className='bg-transparent border border-1 w-[60px] outline-none text-center'
                        required
                        maxLength={3}
                        ref={part3Ref}
                      />
                    </div>
                  </div>
                  <div className="relative col-span-4 row-span-2 w-[100%] mt-[10px]">
                    <textarea
                      className="border border-[#B2BCCA] text-sm rounded-lg outline-none px-4 py-4 min-h-[200px] w-full"
                      value={carInfo}
                      onChange={(e) => setcarInfo(e.target.value)}
                      required
                    ></textarea>
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Avtomobil haqqında</span>
                  </div>
                  <CustomButton title='Növbəti' btnType="submit" containerStyles='mx-auto my-4 bg-[#000919] text-white rounded-lg w-[100%] col-span-4 row-span-2' handleClick={handleNext} />
                </form>
              )}

              {currentStep === 2 && (
                <>
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='text-center'>
                      <h2 className='text-[#000919] font-semibold text-lg'>Şəkillər</h2>
                      <ul className='text-sm text-[#000919]'>
                        <li>- Maksimum 100 MB həcmdə şəkil</li>
                        <li>- Optimal ölçü – 1024 x 760 piksel.</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center w-36 h-36 mt-4">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-36 h-36 border-2 border-[#000919] border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                          <svg className="mb-2 text-[#000919] h-12 w-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p className="mb-2 text-[#000919] text-sm text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-[#000919] text-xs text-center">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} multiple />
                      </label>
                    </div>
                    <div className='mt-8 w-full'>
                      <h2 className="text-[#000919] text-lg mb-4">Əlavə olunmuş şəkillər aşağıda görünəcək</h2>
                      <div className="flex flex-wrap justify-center bg-gray-100 w-full rounded-lg">
                        {addedImages.map((image, index) => (
                          <div key={index} className="relative mx-2 my-1">
                            <button
                              className="absolute top-1 right-1 w-5 h-5 bg-black-100 text-white rounded-full text-xs"
                              onClick={() => removeImage(index)}
                            >
                              X
                            </button>
                            <img src={image && URL?.createObjectURL(image)} alt={`Added Image ${index + 1}`} className="max-w-[150px] max-h-[150px] rounded-lg shadow" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <CustomButton title='Geri' btnType="button" containerStyles='bg-[#000919] text-white rounded-lg' handleClick={handleBack} />
                      <CustomButton title='Əlavə et' btnType="button" containerStyles='bg-[#000919] text-white rounded-lg' handleClick={handleAddCar} />
                    </div>
                  </div>
                </>
              )}

            </div>
          </form>
        }
      />

      {/* Edit car popup */}
      <CustomPopup isOpen={editcarPopup.isOpen} closeModal={() => seteditcarPopup({ isOpen: false, car: null })}
        popupContent={
          <form className='flex flex-col w-full h-full pt-8 pb-4'>
            <h1 className='font-bold text-2xl text-[#000919] w-[90%] mx-auto max-sm:text-center'>Avtomobil Məlumatları</h1>
            <div className='sm:w-[90%] w-[100%] h-full mx-auto mt-8'>
              {currentStep === 1 && (
                <form className='grid grid-cols-2 grid-rows-2 gap-4'>
                  <div className='w-100% max-sm:flex-col flex col-span-4 row-span-2'>
                    <BrandFilter options={brands?.car_brands} setSelectedBrand={setSelectedBrand} selectedBrand={selectedBrand} setSelectedModel={setSelectedModel} />
                    <ModelFilter options={models?.car_brand_models} setSelectedModel={setSelectedModel} selectedModel={selectedModel} selectedBrand={selectedBrand} />
                    <CityFilter options={cities?.cities} setSelectedCity={setSelectedCity} selectedCity={selectedCity} />
                    <ColorFilter title="Rəng" options={colors?.car_colors} setSelectedColor={setSelectedColor} selectedColor={selectedColor} />
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <input
                      className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                      type='text'
                      value={carVin}
                      onChange={(e) => setcarVin((e.target.value).toUpperCase())}
                      required
                    />
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">VIN</span>
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <input
                      className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                      type='text'
                      value={carYear}
                      maxLength={4}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && !(value.startsWith('0')) && value !== "0") {
                          setcarYear((value).toUpperCase())
                        }
                      }}
                      required
                    />
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">İL</span>
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <input
                      className="border border-1 border-[#B2BCCA] text-[14px] rounded-[8px] outline-none w-full px-[20px] py-[10px] relative"
                      type='text'
                      value={carPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && !(value.startsWith('0')) && value !== "0") {
                          setcarPrice(value);
                        }
                      }}
                      required
                    />
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Qiymət</span>
                  </div>
                  <div className="relative md:col-span-1 col-span-4 row-span-1">
                    <div className='platebg text-[14px] outline-none max-w-[300px] w-[100%] px-[40px] py-[10px] relative flex justify-center items-center'>
                      <input
                        type="text"
                        value={carPlateValues.part1}
                        onChange={(e) => handleChangeCarPlate(e, 'part1', 2, /^[0-9]*$/)}
                        className='ml-[10px] bg-transparent border border-1 w-[50px] outline-none text-center'
                        required
                        maxLength={2}
                        ref={part1Ref}
                      />
                      <span className='mx-[10px]'>-</span>
                      <input
                        type="text"
                        value={carPlateValues.part2}
                        onChange={(e) => handleChangeCarPlate(e, 'part2', 2, /^[A-Za-z]*$/)}
                        className='bg-transparent border border-1 w-[50px] outline-none text-center uppercase'
                        required
                        maxLength={2}
                        ref={part2Ref}
                      />
                      <span className='mx-[10px]'>-</span>
                      <input
                        type="text"
                        value={carPlateValues.part3}
                        onChange={(e) => handleChangeCarPlate(e, 'part3', 3, /^[0-9]*$/)}
                        className='bg-transparent border border-1 w-[60px] outline-none text-center'
                        required
                        maxLength={3}
                        ref={part3Ref}
                      />
                    </div>
                  </div>
                  <div className="relative col-span-4 row-span-2 w-[100%] mt-[10px]">
                    <textarea
                      className="border border-[#B2BCCA] text-sm rounded-lg outline-none px-4 py-4 min-h-[200px] w-full"
                      value={carInfo}
                      onChange={(e) => setcarInfo(e.target.value)}
                      required
                    ></textarea>
                    <span className="absolute top-[-16px] bg-white text-[#828282] p-[5px] text-[14px] left-[20px]">Avtomobil haqqında</span>
                  </div>
                  <CustomButton title='Növbəti' btnType="submit" containerStyles='mx-auto my-4 bg-[#000919] text-white rounded-lg w-[100%] col-span-4 row-span-2' handleClick={handleNext} />
                </form>
              )}

              {currentStep === 2 && (
                <>
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='text-center'>
                      <h2 className='text-[#000919] font-semibold text-lg'>Şəkillər</h2>
                      <ul className='text-sm text-[#000919]'>
                        <li>- Maksimum 100 MB həcmdə şəkil</li>
                        <li>- Optimal ölçü – 1024 x 760 piksel.</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center w-36 h-36 mt-4">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-36 h-36 border-2 border-[#000919] border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                          <svg className="mb-2 text-[#000919] h-12 w-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p className="mb-2 text-[#000919] text-sm text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-[#000919] text-xs text-center">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} multiple />
                      </label>
                    </div>
                    <div className='mt-8 w-full'>
                      <h2 className="text-[#000919] text-lg mb-4">Əlavə olunmuş şəkillər aşağıda görünəcək</h2>
                      <div className="flex flex-wrap justify-center bg-gray-100 w-full rounded-lg">
                        {addedImages.map((image, index) => (
                          <div key={index} className="relative mx-2 my-1">
                            <button
                              className="absolute top-1 right-1 w-5 h-5 bg-black-100 text-white rounded-full text-xs"
                              onClick={() => removeImage(index)}
                            >
                              X
                            </button>
                            <img src={image && URL?.createObjectURL(image)} alt={`Added Image ${index + 1}`} className="max-w-[150px] max-h-[150px] rounded-lg shadow" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <CustomButton title='Geri' btnType="button" containerStyles='bg-[#000919] text-white rounded-lg' handleClick={handleBack} />
                      <CustomButton title='Əlavə et' btnType="button" containerStyles='bg-[#000919] text-white rounded-lg' handleClick={handleAddCar} />
                    </div>
                  </div>
                </>
              )}

            </div>
          </form>
        }
      />

      {/* Reserve slots popup */}
      <CustomPopup isOpen={slotPopup.isOpen} closeModal={() => setslotPopup({ isOpen: false, car: null })}
        popupContent={
          <div className='flex flex-col w-full h-full pt-8 pb-4'>
            <h1 className='font-bold text-2xl text-[#000919] w-full'>Reserve Təqvimi</h1>
            {slots && slots?.slots?.length == 0 ?
              (<div className='w-[100%] h-full mx-auto mt-3'>
                <div className="flex flex-col w-full">
                  <div className="border p-4 rounded-lg shadow-md w-full">
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={handlePrevMonth} className="text-gray-500"><LuChevronLeftSquare /></button>
                      <div className="text-center">
                        <span className="text-xl font-semibold">{` ${monthsInAzerbaijani[currentMonth]} ${currentYear}`}</span>
                      </div>
                      <button onClick={handleNextMonth} className="text-gray-500"><LuChevronRightSquare /></button>
                    </div>
                    <div className="w-full">
                      <div className='grid grid-cols-7 gap-1 w-full'>
                        {daysOfWeek.map((day) => (
                          <div key={day} className="w-10 h-10 text-[#000919] flex items-center justify-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className='grid grid-cols-7 gap-1 text-center'>
                        {dates.map((date) => (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(new Date(Date.UTC(currentYear, currentMonth, date)))}
                            className={`w-10 h-10 border border-[#000919] ${selectedDate?.getDate() === date && selectedDate?.getMonth() === currentMonth
                              ? 'bg-[#000919] text-white'
                              : 'hover:bg-gray-200'
                              }`}
                          >
                            {date}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="mt-4 h-auto p-4 border rounded-lg shadow-md w-full">
                      <div className="grid grid-cols-1 gap-2">
                        {timeSlots.map((slot, index) => (
                          <div key={index} className="border rounded-lg flex justify-center items-center w-full text-sm border-[#000919]">
                            <span className='flex m-[10px] justify-center w-[100%] items-center'>
                              <LuCalendarDays className='mr-[8px] h-[25px] w-[25px]' />
                              {formatDate(slot.date)}
                            </span>
                            <span className='flex m-[10px] justify-center w-[100%] items-center'>
                              <LuClock3 className='mr-[8px] h-[25px] w-[25px]' />
                              {slot.time}
                            </span>

                            <button
                              onClick={() => handleRemoveTimeSlot(index)}
                              className="text-red-500 text-2xl mr-[10px]"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <input
                          type="time"
                          value={newTimeSlot.time}
                          onChange={(e) => setNewTimeSlot({ time: e.target.value, car_id: slotPopup?.car?.id })}
                          className="p-2 mt-[10px] border rounded-lg w-full"
                        />
                        <button
                          onClick={handleAddTimeSlot}
                          className="mt-[15px] p-2 border border-[#000919] text-[#000919] rounded-lg w-full flex justify-center items-center"
                        >
                          <LuPlusSquare className='mr-[15px]' /> Əlavə et
                        </button>
                      </div>
                    </div>
                  )}

                </div>
                {timeSlots.length > 0 &&
                  <div className="flex justify-between my-4">
                    <CustomButton title='Yadda saxla' btnType="button" containerStyles='bg-[#000919] text-white w-full rounded-lg' handleClick={addAvailableSlot} />
                  </div>}
              </div>)
              :
              (<div className='mx-auto w-[100%] min-w-[20vw]'>
                <div className="mt-4 w-[100%]">
                  <div className="grid grid-cols-1 gap-2 w-[100%]">
                    {slots?.slots?.map((slot: any, index: any) => (
                      <p
                        key={index}
                        className="border rounded-lg flex justify-center items-center w-full text-sm"
                      >
                        <span className='flex m-[10px] justify-center w-[100%] items-center'>
                          <LuCalendarDays className='mr-[8px] h-[25px] w-[25px]' />
                          {formatDate(slot.date)}
                        </span>
                        <span className='flex m-[10px] justify-center w-[100%] items-center'>
                          <LuClock3 className='mr-[8px] h-[25px] w-[25px]' />
                          {formatTime(slot.start_time)}
                        </span>
                      </p>
                    ))}
                    <button
                      onClick={() => deleteAvailableSlot(slotPopup?.car?.id)}
                      className="bg-[#000919] p-4 text-[#fff] border rounded-lg flex justify-center items-center"
                    >
                      Hamısını sil
                    </button>
                  </div>
                </div>
              </div>)
            }
          </div>
        }
      />
    </div>
  )
}

export default Dashoard