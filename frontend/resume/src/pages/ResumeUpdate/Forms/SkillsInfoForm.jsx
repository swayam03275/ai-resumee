import React from 'react'
import Input from "../../../componets/inputs/Input"

import { LuPlus, LuTrash2 } from "react-icons/lu";


const SkillsInfoForm = ({ skillsInfo, updateSection }) => {
    const handleProfChange = (e) => {
        const value = e.target.value;
        const formattedValue = value
            .replace(/,/g, ', ')
            .replace(/;/g, '; ')
            .replace(/\s+/g, ' ');
        updateSection('prof', formattedValue);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        const formattedValue = value
            .replace(/,/g, ', ')
            .replace(/;/g, '; ')
            .replace(/\s+/g, ' ');
        updateSection('name', formattedValue);
    };

    return (
        <div className='px-5 pt-5'>
            <h2 className='text-lg font-semibold text-gray-900'>Skills</h2>
            <div className='mt-4 '>
                <label className='text- font-medium text-slate-600'>
                    Professional Skills
                </label>
                <textarea
                    placeholder='React, Next.js, Node.js, Redis...'
                    className='form-input w-full mt-1'
                    rows={3}
                    value={skillsInfo?.prof || ""}
                    onChange={handleProfChange}
                />
            </div>
            <div className='mt-3 '>
                <label className='text-sm font-medium text-slate-600'>
                    Technical Skills
                </label>
                <textarea
                    placeholder='React, Next.js, Node.js, Redis...'
                    className='form-input w-full mt-1'
                    rows={3}
                    value={skillsInfo?.name || ""}
                    onChange={handleNameChange}
                />

            </div>

        </div>
    )
}

export default SkillsInfoForm