"use client"

import { BrandFilter, CarCard, CityFilter, ColorFilter, CustomButton, ModelFilter } from '@/components'
import ShowMore from '@/components/ShowMore';
import { HomeProps } from '@/types';
import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getBrands, getCities, getColor, getModels } from '@/lib/slices/filterSlice';
import { BrandProps, CityProps, ColorProps, ModelProps } from '@/types';
import { getAllCars, getCarPhotos } from "@/lib/slices/carSlice";
import Cookies from 'js-cookie';


export default function page({ searchParams }: HomeProps) {

  const dispatch = useAppDispatch();
  

  const authToken = Cookies.get('token');
  const { colors, cities, brands, models } = useAppSelector((state) => state.filter);
  const { allCars } = useAppSelector((state) => state.car);

  const [selectedCity, setSelectedCity] = useState<CityProps | "">("");
  const [selectedColor, setSelectedColor] = useState<ColorProps | "">("");
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | "">("" as BrandProps);
  const [selectedModel, setSelectedModel] = useState<ModelProps | "">("" as ModelProps);
  useEffect(() => {
    dispatch(getColor())
    dispatch(getCities())
    dispatch(getBrands())
    dispatch(getAllCars())
  }, [dispatch]);


  // useEffect(() => {
  //   if (authToken && allCars?.cars?.length) {
  //     allCars.cars.forEach((car: any) => {
  //       dispatch(getCarPhotos({ Authorization: authToken, car_id: car.id }));
  //     });
  //   }
  // }, [authToken, allCars?.cars, dispatch]);

  useEffect(() => {
    if ((selectedBrand as BrandProps)?.id) {
      dispatch(getModels({ id: (selectedBrand as BrandProps)?.id }))
    }
  }, [(selectedBrand as BrandProps)?.id]);

  // const updateUrl = () => {
  //   const queryParams = new URLSearchParams();
  //   if ((selectedBrand as BrandProps)?.name) queryParams.append('marka', (selectedBrand as BrandProps)?.name);
  //   if ((selectedModel as ModelProps)?.name) queryParams.append('model', (selectedModel as ModelProps)?.name);
  //   if ((selectedCity as CityProps)?.name) queryParams.append('şəhər', (selectedCity as CityProps)?.name);
  //   if ((selectedColor as ColorProps)?.name) queryParams.append('rəng', (selectedColor as ColorProps)?.name);

  //   const searchUrl = `?${queryParams.toString()}`;
  //   if (searchUrl === '?') {
  //     window.history.replaceState({}, '', '/cars');
  //   } else {
  //     window.history.replaceState({}, '', searchUrl);
  //   }
  // };

  const handleSearch = () => {
    const urlRequest = {
      brand_id: (selectedBrand as BrandProps)?.id,
      model_id: (selectedModel as ModelProps)?.id,
      city_id: (selectedCity as CityProps)?.id,
      color_id: (selectedColor as ColorProps)?.id,
    };

    dispatch(getAllCars(urlRequest));
    // updateUrl();
  };

  // useEffect(() => {
  //   updateUrl();
  // }, [selectedBrand, selectedModel, selectedCity, selectedColor]);
  const isDataEmpty = !Array.isArray(allCars?.cars) || allCars?.cars.length < 1 || !allCars;

  return (
    <div className="mt-2 padding-x padding-y max-width min-h-[100vh]" id="discorver">
      <div className="home__text-container mt-[70px]">
        <h1 className="text-4xl font-extrabold">Filterlə istədiyini daha sürətli tap</h1>
        <form className='bg-red flex max-lg:flex-col w-full'>
          <BrandFilter options={brands?.car_brands} setSelectedBrand={setSelectedBrand} selectedBrand={selectedBrand} setSelectedModel={setSelectedModel} />
          <ModelFilter options={models?.car_brand_models} setSelectedModel={setSelectedModel} selectedModel={selectedModel} selectedBrand={selectedBrand} />
          <CityFilter options={cities?.cities} setSelectedCity={setSelectedCity} selectedCity={selectedCity} />
          <ColorFilter title="Rəng" options={colors?.car_colors} setSelectedColor={setSelectedColor} selectedColor={selectedColor} />
          <CustomButton title='Axtar' btnType="button" containerStyles='rounded-lg text-white bg-[#000919] shadow-md md:ml-[8px] sm:my-[8px] my-[8px] sm:text-[16px] text-[15px] w-[100%] w-full ' handleClick={handleSearch} />
        </form>
      </div>
      {!isDataEmpty ? (
        <section>
          <div className='home__cars-wrapper'>
            {allCars?.cars?.map((car: any) => (
              <CarCard
                key={car.id}
                car={car}
                // carImages={car_images?.car_images?.filter((image: any) => image.car_id === car.id)}
              />
            ))}
          </div>
          <ShowMore
            pageNumber={(searchParams.limit || 2) / 2}
            isNext={(searchParams.limit || 2) > allCars?.cars?.length}
          />
        </section>
      ) : (
        <div className='home__error-container'>
          <h2 className='text-black text-xl font-bold'>{allCars?.response?.data?.error}</h2>
        </div>
      )}
    </div>
  )
}
