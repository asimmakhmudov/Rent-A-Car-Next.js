"use client"

import { FaqProps } from "@/types";
import React, { useRef, useState } from "react";

const MyFaq = ({ title, faqcontent }: FaqProps) => {
  const [accordion, setAccordion] = useState<string>("");
  const [accordionHeight, setAccordionHeight] = useState<string>("0px");
  const [iconRotate, setIconRotate] = useState<string>("+");

  const content = useRef<HTMLDivElement>(null);

  const accordionHandler = () => {
    setAccordion(accordion === "" ? "active" : "");
    setAccordionHeight(
      accordion === "active" ? "0px" : `${content.current?.scrollHeight}px`
    );
    setIconRotate(accordion === "active" ? "+" : "-");
  };

  return (
    <div className={`flex bg-white rounded-lg shadow-lg flex-col sm:max-w-[600px] w-[100%] mt-[20px] ${accordion}`}>
      <button
        className={`${accordion} flex justify-between w-full bg-transparent items-center text-left border-none px-4 py-6 cursor-pointer outline-none`}
        onClick={accordionHandler}
      >
        <p className="text-secondary text-[18px] font-semibold">
          {title}
        </p>
        <span className="text-[24px] text-gray-400">{iconRotate}</span>
      </button>
      <div
        ref={content}
        style={{
          maxHeight: `${accordionHeight}`,
          transition: "max-height 0.3s ease-in-out", // Smooth transition
        }}
        className="overflow-hidden transition-all duration-600 ease-in-out border-t font-sans"
      >
        <div className="p-4">{faqcontent}</div>
      </div>
    </div>
  );
};

export default MyFaq;
