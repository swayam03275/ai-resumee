import React from 'react'
import { GiTireIronCross } from "react-icons/gi";

const Modal = ({
    children,
    isOpen,
    onClose,
    title,
    hideHeader,
    showActionBtn,
    actionBtnIcon=null,
    actionBtnText,
    onActionClick,
    description,
    }) => {
        if(!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center w-full h-full '>
        {/* modal content */}
        <div className={`relative flex flex-col bg-white
             overflow-hidden`}>
            {/* modal Header */}
            {!hideHeader && (
                <div className='flex items-center justify-between p-4 '>
                    <h3 className='md:text-lg font-medium text-gray-900'>{title}</h3>
                    <p className='text-xs text-gray-700'>{description}</p>
                    {showActionBtn && (
                         <button
                         className='btn-small mr-12 '
                         onClick={()=> onActionClick()}
                         >
                             {actionBtnIcon}
                             {actionBtnText}
                         </button>
                    )}
               </div>
            )}
            <button type='button' className='text-gray-700 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5' onClick={onClose}>
                
            <GiTireIronCross/>
            </button>

            {/* modal body (scrollable) */}
            <div>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Modal