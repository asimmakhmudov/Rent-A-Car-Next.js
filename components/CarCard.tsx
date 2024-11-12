"use client";

import { useEffect, useState } from "react";
import { CarProps } from "@/types";
import CustomPopup from "./CustomPopup";
import Link from "next/link";
import 'react-gallery-carousel/dist/index.css';
import { LuChevronLeft, LuChevronRight, LuCalendarDays, LuClock3, LuMapPin, LuMail, LuPhoneOutgoing } from "react-icons/lu";
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getAllModels, getBrands, getCities, getColor } from '@/lib/slices/filterSlice';
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import { getCarPhotos, getCarSlots, resetCarImages } from "@/lib/slices/carSlice";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import MyFaq from "./MyFaq";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { formatDate, formatTime } from "@/utils/functions";
import { getUserType } from "@/lib/slices/userSlice";

interface CarCardProps {
  car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => {
  const dispatch = useAppDispatch();
  const authToken = Cookies.get('token');
  type E164Number = string;
  const { isLoading, user } = useAppSelector((state) => state.user);
  const [carDetails, setcarDetails] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [checkoutPopup, setcheckoutPopup] = useState<{ isOpen: boolean; reserveDate: any }>({ isOpen: false, reserveDate: null });
  const [paidPopup, setpaidPopup] = useState<{ isOpen: boolean; data: any }>({ isOpen: false, data: null });

  const { colors, cities, brands, allmodels } = useAppSelector((state) => state.filter);
  const { car_images, slots } = useAppSelector((state) => state.car);
  const [selectedDate, setSelectedDate] = useState<{ date: any; id: any }>({ date: null, id: null });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [promocode, setPromocode] = useState("")
  const [isFocused, setIsFocused] = useState({ promocode: false });
  const handleDateClick = (data: any) => {
    setSelectedDate(data);
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  useEffect(() => {
    dispatch(getUserType({ Authorization: authToken }))
    dispatch(getColor())
    dispatch(getCities())
    dispatch(getBrands())
    dispatch(getAllModels())
  }, [dispatch]);


  const handleGetInformation = () => {
    dispatch(resetCarImages())
    dispatch(getCarPhotos({ Authorization: authToken, car_id: car.id }))
    dispatch(getCarSlots({ Authorization: authToken, car_id: car.id }))
  }

  const handleAddAppointment = () => {
    const appointment = {
      car_available_slots_id: checkoutPopup?.reserveDate?.id,
      car_id: car?.id,
      car_owner_id: car?.car_owner_id
    }
  }
  const carouselItems = car_images?.car_images?.
    map((img: any, index: any) => (
      <Slide key={index} index={index} className="">
        <img src={img?.image} alt="car image" className="h-full w-full object-cover" />
      </Slide>
    ))

  return (
    <>
      <div className="flex flex-col bg-white border rounded-xl shadow-2xl cursor-pointer" onClick={() => { setcarDetails({ isOpen: true }), handleGetInformation() }}>
        <img src={car?.car_image} alt='car model' className='object-cover rounded-t-[12px] relative w-full h-[200px]' />
        <div className="car-card__content">
          <h2 className="car-card__content-title">
            {brands?.car_brands?.find((brand: any) => brand.id === car?.brand_id)?.name} - {allmodels?.car_brand_models?.find((model: any) => model.id === car?.model_id)?.name}, {car?.year}
          </h2>
        </div>
        <div className='relative flex flex-col w-full px-[10px] pb-[20px]'>
          <p className='flex  text-[32px] leading-[38px] font-extrabold'>
            <span className='self-start text-sm text-[#000919] leading-[17px] font-bold'>{car?.price} AZN <span className='self-end text-sm text-[#000919] leading-[17px] font-bold'> / saat</span></span>
          </p>
          <p className="text-gray-700 text-sm mt-[5px]">{cities?.cities?.find((city: any) => city.id === car?.city_id)?.name}</p>
        </div>
      </div>


      <CustomPopup isOpen={carDetails.isOpen} closeModal={() => setcarDetails({ isOpen: false })} car={car}
        popupContent={
          <div className="flex flex-col">
            <div>
              <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={55}
                totalSlides={car_images?.car_images ? car_images?.car_images?.length : 0}
                className="relative mt-[30px]"
              >
                <Slider className="relative">
                  {carouselItems}
                </Slider>
                <ButtonBack className="absolute max-sm:top-[40%] sm:top-[45%] text-[#fff] left-[0px] p-[10px] glass mx-[5px] rounded-full h-auto flex justify-center items-center bg-[red]"><LuChevronLeft /></ButtonBack>
                <ButtonNext className="absolute max-sm:top-[40%] sm:top-[45%] text-[#fff] right-[0px] p-[10px] glass mx-[5px] rounded-full h-auto flex justify-center items-center bg-[red]"><LuChevronRight /></ButtonNext>
              </CarouselProvider>
            </div>
            <div className='flex-1 flex flex-col gap-2'>
              <div className='flex gap-4 flex-col justify-between w-full text-left'>
                <table className="w-full mx-auto border-collapse bg-white shadow-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 bg-gradient-to-r from-gray-300 to-gray-400 text-black font-bold text-xl capitalize">
                        {brands?.car_brands?.find((brand: any) => brand.id === car?.brand_id)?.name},
                        {allmodels?.car_brand_models?.find((model: any) => model.id === car?.model_id)?.name},
                        {car?.year}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 flex items-center justify-between">
                        <span className="font-semibold text-black">Qiymət:</span>
                        <span className="text-gray-700">{car?.price} <span className="text-sm">/saat</span></span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6">
                        <span className="font-semibold text-black">Ətraflı:</span>
                        <p className="mt-2 text-gray-700 text-sm sm:w-[40vw]">
                          {car?.description}
                        </p>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 flex justify-between">
                        <span className="font-semibold text-black">İl:</span>
                        <span className="text-gray-700">{car?.year}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 flex justify-between">
                        <span className="font-semibold text-black">Şəhər:</span>
                        <span className="text-gray-700">{cities?.cities?.find((city: any) => city.id === car?.city_id)?.name}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 flex justify-between items-center">
                        <span className="font-semibold text-black">Rəng:</span>
                        <div className="flex items-center">
                          <div
                            className="h-5 w-5 mr-2 rounded border border-gray-300"
                            style={{ backgroundColor: colors.car_colors?.find((color: any) => color.id === car?.color_id)?.code }}
                          ></div>
                          <span className="text-gray-700">{colors.car_colors?.find((color: any) => color.id === car?.color_id)?.name}</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 flex justify-between">
                        <span className="font-semibold text-black">Qeydiyyat Nömrəsi:</span>
                        <span className="text-gray-700">{car?.car_number}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 flex justify-between">
                        <span className="font-semibold text-black">VIN kod:</span>
                        <span className="text-gray-700">{car?.vin}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className='w-[100%] h-[100%] mx-auto mt-[10px]'>
                  <div className="my-3">
                    {(user?.profile?.user_id) === (car?.car_owner_id) ?
                      <Link href="/dashboard">
                        <button className='mt-2 bg-[#000919] text-white rounded-[12px] padding-y padding-x text-[12px] w-[100%] '>Məlumatlara bax</button>
                      </Link>
                      :
                      <div className="flex flex-col">
                        {authToken ?
                          <div className="mt-4 md:mt-0">
                            {slots?.slots?.length > 0 ? (
                              <>
                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                                  {slots?.slots.map((slot: any, index: any) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        handleTimeSlotClick(slot?.start_time),
                                          handleDateClick({ date: slot?.date, id: slot?.id })
                                      }}
                                      className={`p-2 border-2 rounded-lg transition duration-300 ease-in-out flex justify-center items-center w-full text-sm ${selectedTimeSlot === slot.start_time
                                        ? 'border-[#000919] text-[#000919]'
                                        : ''
                                        }`}
                                    >
                                      {selectedTimeSlot === slot.start_time && <span className='mr-[5px]'>✅</span>}
                                      <span className='flex justify-center mx-[10px] items-center'>
                                        <LuCalendarDays className='mr-[8px] h-[25px] w-[25px]' />
                                        {formatDate(slot.date)}
                                      </span>
                                      <span className='flex justify-center mx-[10px] items-center'>
                                        <LuClock3 className='mr-[8px] h-[25px] w-[25px]' />
                                        {formatTime(slot.start_time)}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                                <button className="bg-[#000919] text-white text-center rounded-[8px] my-5 w-[100%] h-[40px] flex justify-center items-center"
                                  onClick={() => {
                                    if ((selectedDate.date != "") && (selectedTimeSlot != "")) {
                                      setcarDetails({ isOpen: false })
                                      setcheckoutPopup({ isOpen: true, reserveDate: { id: selectedDate.id, date: selectedDate.date, time: selectedTimeSlot } })
                                    }
                                    else {
                                      swal("Yenidən sınayın!", "Zəhmət olmasa reserve tarixi seçin", "info");
                                    }
                                  }}
                                >
                                  Rezerv et
                                </button>
                              </>
                            )
                              :
                              (
                                <div className="bg-[#000919] text-white text-center rounded-[8px] w-[100%] h-[40px] flex justify-center items-center">
                                  İstifadəçi rezerv tarixi əlavə etməmişdir.
                                </div>
                              )
                            }
                          </div>
                          :
                          <div className="text-center rounded-[8px] w-[100%] h-[40px] flex justify-center items-center"
                          >
                            <span className="mr-[15px] font-bold text-[#000919]">Rezerv etmək üçün Hesabınıza</span>
                            <Link href='/auth'>
                              <CustomButton title='Daxil olun' btnType="button" containerStyles='bg-[#000919] text-white text-center rounded-[8px] w-[100%] h-[40px] flex justify-center items-center' />
                            </Link>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>

              </div>
            </div>
          </div>
        }
      />

      <CustomPopup isOpen={checkoutPopup.isOpen} closeModal={() => setcheckoutPopup({ isOpen: false, reserveDate: null })} reserveDate={checkoutPopup.reserveDate}
        popupContent={
          <div className="flex flex-col">
            <div className="flex flex-col-reverse justify-end">
              <div className='flex flex-col items-center w-[100%] mt-[20px]'>
                <div className="flex bg-white rounded-lg shadow-lg p-6 flex-col sm:max-w-[600px] w-[100%]">
                  <h2 className="text-lg font-bold mb-6">Ödəniş detalları</h2>
                  <div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-4 sm:col-span-4">
                        <label htmlFor="card-number" className="block text-[12px] font-medium text-gray-700 mb-2">Card Number</label>
                        <input type="text" name="card-number" id="card-number" placeholder="0000 0000 0000 0000" className="w-full py-3 px-4 border text-[13px] border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" />
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <label htmlFor="expiration-date" className="block text-[12px] font-medium text-gray-700 mb-2">Expiration Date</label>
                        <input type="text" name="expiration-date" id="expiration-date" placeholder="MM / YY" className="w-full py-3 px-4 border text-[13px] border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="cvv" className="block text-[12px] font-medium text-gray-700 mb-2">CVV</label>
                        <input type="text" name="cvv" id="cvv" placeholder="000" className="w-full py-3 px-4 border text-[13px] border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" />
                      </div>
                      <div className="col-span-4 sm:col-span-4">
                        <label htmlFor="card-holder" className="block text-[12px] font-medium text-gray-700 mb-2">Card Holder</label>
                        <input type="text" name="card-holder" id="card-holder" placeholder="Full Name" className="w-full py-3 px-4 border text-[13px] border-gray-400 rounded-lg focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <CustomButton title='Təsdiqlə' btnType="button" containerStyles='bg-[#000919] text-white rounded-[12px] w-[100%] mt-8'
                      handleClick={
                        () => {
                          setcheckoutPopup({ isOpen: false, reserveDate: { date: selectedDate.date, time: selectedTimeSlot } })
                          setpaidPopup({ isOpen: true, data: null })
                          handleAddAppointment()
                        }
                      } />
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-center w-[100%] '>
                <div className='flex bg-white rounded-lg shadow-lg flex-col sm:max-w-[600px] w-[100%] mt-[25px] pb-[15px]'>
                  <p className="text-secondary text-[18px] font-semibold mt-3 ml-[10px]">
                    Avtomobil Məlumatları
                  </p>
                  <div className="flex mt-[10px] max-sm:flex-col">
                    <div className='relative ml-[10px]'>
                      <img src={car?.car_image} alt='car model' className='object-cover rounded-[8px] w-[150px] h-[100%]' />
                    </div>
                    <div className="flex flex-col pl-[10px] justify-start items-start">
                      <div className="bg-gradient-to-r text-black font-bold text-lg capitalize w-[100%]">
                        {brands?.car_brands?.find((brand: any) => brand.id === car?.brand_id)?.name},
                        {allmodels?.car_brand_models?.find((model: any) => model.id === car?.model_id)?.name},
                        {car?.year}
                      </div>


                      <p className='p-2 mt-[10px] border-2 rounded-lg transition duration-300 ease-in-out flex justify-start items-center text-[13px]'>
                        <span className='flex justify-start mx-[10px] items-center'>
                          <LuCalendarDays className='mr-[8px] h-[15px] w-[15px]' />
                          {formatDate(checkoutPopup.reserveDate?.date)}
                        </span>
                        <span className='flex justify-start mx-[10px] items-center'>
                          <LuClock3 className='mr-[8px] h-[15px] w-[15px]' />
                          {formatTime(checkoutPopup.reserveDate?.time)}
                        </span>
                      </p>
                      <p className='flex mt-2 text-sm font-extrabold'>
                        <span className="font-semibold text-black mr-[5px]">Ödəniləcək məbləğ:</span>
                        <span className="text-green-700">{car?.price}<span className="text-sm">/saat</span></span>
                      </p>
                    </div>
                  </div>
                </div>
                <MyFaq title='Promokod' faqcontent={
                  <div className='p-4 h-[80px] relative'>
                    <div className="relative col-span-2 sm:col-span-1">

                      <CustomInput
                        name='Promokod'
                        inputType='text'
                        value={promocode}
                        isFocus={isFocused}
                        onChange={
                          (e) => {
                            setPromocode(e.target.value);
                            if (e.target.value !== '') {
                              setIsFocused({ ...isFocused, promocode: true });
                            }
                          }
                        }
                        onFocus={
                          () => setIsFocused({ ...isFocused, promocode: true })
                        }
                        onBlur={() => setIsFocused({ ...isFocused, promocode: false })}
                      />
                    </div>
                  </div>
                } />
              </div>
            </div>
          </div>
        }
      />

      <CustomPopup isOpen={paidPopup.isOpen} closeModal={() => setpaidPopup({ isOpen: false, data: null })}
        popupContent={
          <div className="flex max-md:flex-col-reverse px-2 padding-y max-width">
            <div className='flex flex-col md:items-start items-center p-6 w-[100%]'>
              <div className='w-[100%]'>
                <h1 className='text-[28px] font-bold text-[#020618]'>Avtomobil Sahibi</h1>
                <div className="flex p-2">
                  <div className="flex flex-col p-4">
                    <h2 className="car-card__content-title">
                      Riyad Əliyev
                    </h2>
                    <div className="flex items-center justify-start mt-[10px]">
                      <LuPhoneOutgoing className="text-[#138610] capitalize text-[18px] mr-[10px]" />
                      <p className='text-black-100 font-semibold text-[13px]'>
                        +994 050 777 77 77
                      </p>
                    </div>
                    <div className="flex items-center justify-start mt-[10px]">
                      <LuMail className="text-[#138610] capitalize text-[18px] mr-[10px]" />
                      <p className='text-black-100 font-semibold text-[13px]'>
                        riyafdaliyev@gmail.com
                      </p>
                    </div>
                    <Link href="/dashboard">
                      <button className='mt-8 bg-[#000919] text-white rounded-[12px] padding-y padding-x text-[12px] w-[100%] '>Məlumatlara bax</button>
                    </Link>
                  </div>

                </div>


              </div>

            </div>
          </div>
        }
      />


    </>
  );
};

export default CarCard;