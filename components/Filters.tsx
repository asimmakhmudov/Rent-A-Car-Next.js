// "use client"

// import React, { useEffect, useState } from 'react'
// import { CityFilter, ColorFilter, BrandFilter, CustomButton, ModelFilter } from '.'
// import { useAppSelector, useAppDispatch } from '@/lib/hooks';
// import { getBrands, getCities, getColor, getModels } from '@/lib/slices/filterSlice';
// import { BrandProps, CityProps, ColorProps, ModelProps } from '@/types';

// const Filters = () => {
//   const dispatch = useAppDispatch();
//   const { colors, cities, brands, models } = useAppSelector((state) => state.filter);

//   const [selectedCity, setSelectedCity] = useState<CityProps | "">("");
//   const [selectedColor, setSelectedColor] = useState<ColorProps | "">("");
//   const [selectedBrand, setSelectedBrand] = useState<BrandProps | "">("" as BrandProps);
//   const [selectedModel, setSelectedModel] = useState<ModelProps | "">("" as ModelProps);
//   useEffect(() => {
//     dispatch(getColor())
//     dispatch(getCities())
//     dispatch(getBrands())
//   }, [dispatch]);


//   useEffect(() => {
//     if ((selectedBrand as BrandProps)?.id) {
//       dispatch(getModels({ id: (selectedBrand as BrandProps)?.id }))
//     }
//   }, [(selectedBrand as BrandProps)?.id]);

//   const handleSearch = () => {
//     const urlRequest = {
//       brand_name: (selectedBrand as BrandProps).name,
//       model_name: (selectedModel as ModelProps).name,
//       city_name: (selectedCity as CityProps).name,
//       color_hex: (selectedColor as ColorProps).code
//     }
//   }

//   return (
//     <form className='bg-red flex max-lg:flex-col w-full'>
//       <BrandFilter options={brands?.car_brands} setSelectedBrand={setSelectedBrand} selectedBrand={selectedBrand} setSelectedModel={setSelectedModel}/>
//       <ModelFilter options={models?.car_brand_models} setSelectedModel={setSelectedModel} selectedModel={selectedModel} selectedBrand={selectedBrand}/>
//       <CityFilter options={cities?.cities} setSelectedCity={setSelectedCity} selectedCity={selectedCity}/>
//       <ColorFilter title="Rəng" options={colors?.car_colors} setSelectedColor={setSelectedColor} selectedColor={selectedColor} />
//       <CustomButton title='Axtar' btnType="button" containerStyles='rounded-lg text-white bg-[#000919] shadow-md sm:m-[8px] my-[8px] sm:text-[16px] text-[15px] w-[100%] w-full md:w-[250px]' handleClick={handleSearch} />
//     </form>
//   )
// }

// export default Filters