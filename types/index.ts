import { MouseEventHandler, SetStateAction, Dispatch } from "react";

export interface CarProps {
  city_mpg?: number;
  class?: string;
  car_image?: any;
  combination_mpg?: number;
  cylinders?: number;
  displacement?: number;
  drive?: string;
  fuel_type?: string;
  highway_mpg?: number;
  make?: string;
  model?: string;
  transmission?: string;
  year?: number;
  price?: number | string;
  id: number;
  vin?: string;
  color_id?: number;
  model_id: number;
  brand_id: number;
  car_owner_id: number;
  city_id: number;
  car_number: string;
  description: string;
}

export interface FilterProps {
  manufacturer?: string;
  year?: number;
  model?: string;
  limit?: number;
  fuel?: string;
}

export interface HomeProps {
  searchParams: FilterProps;
}

export interface CarCardProps {
  model?: string;
  make?: string;
  mpg?: number;
  transmission?: string;
  year?: number;
  drive?: string;
  cityMPG?: number;
}

export interface CustomButtonProps {
  isDisabled?: boolean;
  btnType?: "button" | "submit";
  containerStyles?: string;
  textStyles?: string;
  title: string;
  rightIcon?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface CustomInputProps {
  name?: string;
  required?: boolean;
  disabled?: boolean;
  inputType?: "text" | "email" | "password" | "number" | "textarea";
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  isFocus?: { [key: string]: boolean };
  value?: string;
}



export interface ColorProps {
  name?: any;
  id?: string | number;
  code?: string;
}

export interface CityProps {
  id?: string | number;
  name?: any;
}

export interface BrandProps {
  id?: any;
  name?: any;
}

export interface BrandFilterProps {
  id?: any;
  title?: string;
  brand?: BrandProps[] | undefined;
  options?: BrandProps[] | undefined;
  selectedBrand?: BrandProps | "";
  setSelectedBrand: Dispatch<SetStateAction<"" | BrandProps>>;
  setSelectedModel: Dispatch<SetStateAction<"" | ModelProps>>;
}

export interface ModelProps {
  id?: any;
  name?: any;
}

export interface ModelFilterProps {
  id?: any;
  title?: any;
  model?: ModelProps[] | undefined;
  options?: ModelProps[] | undefined;
  selectedBrand?: BrandProps | "";
  selectedModel?: ModelProps | "";
  setSelectedModel: Dispatch<SetStateAction<"" | ModelProps>>;
}

export interface ColorFilterProps {
  title?: string;
  selectedColor?: ColorProps | "";
  setSelectedColor: Dispatch<SetStateAction<"" | ColorProps>>;
  options?: ColorProps[] | undefined;
}

export interface CityFilterProps {
  title?: string;
  selectedCity?: CityProps | "";
  setSelectedCity: Dispatch<SetStateAction<"" | CityProps>>;
  options?: CityProps[] | undefined;
}

export interface ShowMoreProps {
  pageNumber: number;
  isNext?: boolean;
}

export interface MyDropdownProps {
  myDropdownHeader?: JSX.Element;
  myDropdownContent?: JSX.Element;
}

export interface FaqProps {
  title?: string;
  faqcontent?: JSX.Element;
}


export interface CustomTableProps {
  title?: string;
  thTitles?:  string[];
  theadContent?: JSX.Element;
  tbodyContent?: JSX.Element;
}

export interface CustomPopupProps {
  isOpen?: boolean;
  closeModal: () => void;
  car?: CarProps;
  reserveDate?: any;
  popupContent?:  JSX.Element | string;
}