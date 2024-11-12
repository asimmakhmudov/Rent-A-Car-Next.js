"use client"
import { CarCard, Hero, CustomButton, BrandFilter, ModelFilter, CityFilter, ColorFilter } from "@/components";
import ShowMore from "@/components/ShowMore";
import { HomeProps } from "@/types";
import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getBrands, getCities, getColor, getModels } from '@/lib/slices/filterSlice';
import { BrandProps, CityProps, ColorProps, ModelProps } from '@/types';
import { getAllCars } from "@/lib/slices/carSlice";
import Cookies from 'js-cookie';


export default function Home({ searchParams }: HomeProps) {
  // const authToken = Cookies.get('token');
  const dispatch = useAppDispatch();
  const { colors, cities, brands, models } = useAppSelector((state) => state.filter);
  const { allCars, isLoading, errorCar } = useAppSelector((state) => state.car);

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


  useEffect(() => {
    if ((selectedBrand as BrandProps)?.id) {
      dispatch(getModels({ id: (selectedBrand as BrandProps)?.id }))
    }
  }, [(selectedBrand as BrandProps)?.id]);

  const handleSearch = () => {
    const urlRequest = {
      brand_id: (selectedBrand as BrandProps)?.id,
      model_id: (selectedModel as ModelProps)?.id,
      city_id: (selectedCity as CityProps)?.id,
      color_id: (selectedColor as ColorProps)?.id,
    };

    // const queryParams = new URLSearchParams();
    // if ((selectedBrand as BrandProps)?.name) queryParams.append('brand_name', (selectedBrand as BrandProps)?.name);
    // if ((selectedModel as ModelProps)?.name) queryParams.append('model_name', (selectedModel as ModelProps)?.name);
    // if ((selectedCity as CityProps)?.name) queryParams.append('city_name', (selectedCity as CityProps)?.name);
    // if ((selectedColor as ColorProps)?.name) queryParams.append('color_name', (selectedColor as ColorProps)?.name);

    // Construct the search URL
    // const searchUrl = `/cars?${queryParams.toString()}`;

    // Dispatch the action to get cars
    dispatch(getAllCars(urlRequest));

    // Navigate to the search URL
    // window.location.href = searchUrl;
  };

  const isDataEmpty = !Array.isArray(allCars?.cars) || allCars?.cars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discorver">
        <div className="home__text-container">
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
                  key={car.id} // Added key prop
                  car={car}
                  // carImages={car_images?.car_images?.filter((image: any) => image.car_id === car.id)} // Pass filtered images
                />
              ))}
            </div>
            <ShowMore
              pageNumber={(searchParams.limit || 10) / 10}
              isNext={(searchParams.limit || 10) > allCars?.cars?.length}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>{(isLoading === true) ? "Yüklənir..." : errorCar}</h2>
          </div>
        )}
      </div>
    </main>
  );
}
