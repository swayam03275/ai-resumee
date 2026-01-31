import React from 'react'
import Input from "../../../componets/inputs/Input"

import { LuPlus, LuTrash2 } from "react-icons/lu";

const CertificateInfoForm = ({ certificateInfo, updateArrayItems, addArrayItem, removeArrayItem }) => {
    return (
        <div className='px-5 pt-5'>
            <h2 className='text-lg font-semibold text-gray-900'>Awards & Certifications</h2>

            <div className='mt-4 flex flex-col gap-4 mb-3'>
                {certificateInfo.map((cert, index) => (
                    <div key={index} className='border border-gray-200/80 p-4 rounded-lg relative'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <Input
                                label="Certificate Title"
                                placeholder="FullStack web Developer"
                                type="text"
                                value={cert.title || ""}
                                onChange={({ target }) =>
                                    updateArrayItems(index, "title", target.value)
                                }
                            />


                            <Input
                                label="Issuer"
                                placeholder="Google / Courserra etc"
                                type="text"
                                value={cert.issuer || ""}
                                onChange={({ target }) => updateArrayItems(index, "issuer", target.value)}
                            />

                            <Input
                                label="month-year"
                                placeholder="JAN-2025"
                                type="text"
                                value={cert.year || ""}
                                onChange={({ target }) => updateArrayItems(index, "year", target.value)}
                            />


                            {certificateInfo.length > 1 && (
                                <button
                                    type='button'
                                    className='absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer'
                                    onClick={() => removeArrayItem(index)}
                                >
                                    <LuTrash2 />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
                    type='button'
                    onClick={() => {
                        addArrayItem({
                            title: "",
                            issuer: "",
                            year: '',
                        })
                    }}
                >
                    <LuPlus /> Add Certification
                </button>
            </div>
        </div>
    )
}

export default CertificateInfoForm