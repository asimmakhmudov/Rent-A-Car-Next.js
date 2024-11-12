"use client"

import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { CustomPopupProps } from "@/types";
import 'react-multi-carousel/lib/styles.css';

const CustomPopup = ({ isOpen, closeModal, popupContent, car }: CustomPopupProps) => {
  const [loading, setLoading] = useState(true);

  // Simulate loading content, adjust this as needed for real content loading
  useEffect(() => {
    if (isOpen) {
      setLoading(true); // Start loading when the popup is opened

      // Simulate loading time
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // Adjust timeout as needed

      return () => clearTimeout(timer); // Clear timeout if the component unmounts
    }
  }, [isOpen]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-out duration-300'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='relative max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col items-center justify-start gap-5'>
                  {!loading && (
                    <button
                      type='button'
                      className='absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full'
                      onClick={closeModal}
                    >
                      <img
                        src='/close.svg'
                        alt='close'
                        width={20}
                        height={20}
                        className='object-contain'
                      />
                    </button>
                  )}

                  {loading ? (
                    <div className='flex items-center justify-center w-full h-full'>
                      <div className='spinner'></div>
                    </div>
                  ) : (
                    <div className='w-full h-full'>
                      {popupContent}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left: 4px solid #007bff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
};

export default CustomPopup;
