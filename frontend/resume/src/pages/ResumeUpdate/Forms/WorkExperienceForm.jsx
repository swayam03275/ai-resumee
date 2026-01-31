import React from 'react'
import Input from "../../../componets/inputs/Input"

import { LuPlus, LuTrash2 } from "react-icons/lu";
import { URL } from '../../../AI/AI';

const WorkExperienceForm = ({ workExperience, updateArrayItems, addArrayItem, removeArrayItem }) => {
  
  

  return (
    <div className='px-5 pt-5'>
      <h2 className='text-lg font-semibold text-gray-900'>Work experience</h2>
      <p className='text-xs mt-2 text-gray-600'>For freshers u can write clubs,hackathons internship etc.. </p>

      <div className='mt-4 flex flex-col gap-4 mb-3'>
        {workExperience.map((experience, index) => { 
           const Prompt = {
    contents: [
      {
        parts: [
          {
            text: `
I am building a resume builder app. The user has written the following unstructured self-description. Please rewrite it into a **professional and concise work experience description** suitable for a resume. Keep it formal, 2–4 lines max.

User's input:
- Description: "${experience.description}"
- Company: "${experience.company}"
- Role: "${experience.role}"
- Start Date: "${experience.startDate}"
- End Date: "${experience.endDate}"

Output only the improved experience description.
            `
          }
        ]
      }
    ]
  };

  const handleDescription = async () => {
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Prompt)
      });

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        updateArrayItems(index, "description", aiText);
      } else {
        console.error("Unexpected AI response format:", data);
      }
    } catch (error) {
      console.error("Error generating AI summary:", error);
    }
  };

          return(
            <div key={index} className='border border-gray-200/80 p-4 rounded-lg relative'>
            <div>
             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label="Company"
                placeholder="Google"
                type="text"
                value={experience.company || ""}
                onChange={({ target }) =>
                  updateArrayItems(index, "company", target.value)
                }
              />


              <Input
                label="Role"
                placeholder="Frontend Developer"
                type="text"
                value={experience.role || ""}
                onChange={({ target }) => updateArrayItems( index, "role", target.value)}
              />

              <Input
                label="Start Date"
                type="month"
                value={experience.startDate || ""}
                onChange={({ target }) => updateArrayItems(index, "startDate", target.value)}
              />

              <Input
                label="End Date"

                type="month"
                value={experience.endDate || ""}
                onChange={({ target }) => updateArrayItems(index, "endDate", target.value)}
              />

              
            </div>
            <div className='mt-4 '>
              <div className='flex justify-between'>
                <label className='text-sm font-medium text-slate-600'>
                  Description
                </label>
                <button onClick={handleDescription}  className='cursor-pointer bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800'>Genrate with AI</button>
              </div>
                <div className='text-xs text-slate-600'>
                 Tell us about your work-Experience to Genrate with AI
                </div>
                <textarea placeholder='what did u do in this role?' className='form-input w-full mt-1' rows={3}
                  value={experience.description || ""}
                  onChange={({ target }) => updateArrayItems(index, 'description', target.value)}
                />
              </div>
           

              {workExperience.length > 1 && (
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
          )
          
})}

        <button
          className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
          type='button'
          onClick={() => {
            addArrayItem({
              company: "",
              role: "",
              startDate: '',
              endDate: "",
              description: "",
            })
          }}
        >
          <LuPlus /> Add work experience
        </button>
      </div>
    </div>
  )
}

export default WorkExperienceForm