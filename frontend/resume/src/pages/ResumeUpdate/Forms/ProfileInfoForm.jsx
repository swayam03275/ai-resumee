import React from 'react'
import Input from "../../../componets/inputs/Input"
import { URL } from '../../../AI/AI'

const ProfileInfoForm = ({ profileData, updateSection, onNext }) => {

  const Prompt = {
    "contents": [
      {
        "parts": [
          {
            "text": `
I am building a resume builder app. The user has written the following unstructured self-description. Please rewrite it into a **professional and concise resume summary**, suitable for a tech resume (3–4 lines max). Keep it formal and impactful.

User's input:
"${profileData.summary}"
"${profileData.fullName}"
"${profileData.designation}"

Output only the improved summary.
`
          }
        ]
      }
    ]
  }

  const handleSummary = async () => {
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
        updateSection("summary", aiText);
      } else {
        console.error("AI response format unexpected:", data);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  return (
    <div className='px-5 pt-5 backdrop-blur-[2px] '>
      <h2 className='text-lg text-gray-900 font-semibold'>personal Information</h2>

      <div className='mt-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
            label="full name"
            placeholder="john"
            type="text"
          />
          <Input
            value={profileData.designation || ""}
            onChange={({ target }) => updateSection("designation", target.value)}
            label="Designation"
            placeholder="developer"
            type="text"
          />
        </div>
        <div className='mt-4 '>
          <div className='flex justify-between'>
            <label className='text-sm font-medium text-slate-600'>
              Summary
            </label>
            <button onClick={handleSummary} className='cursor-pointer bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800'>Genrate with AI</button>
          </div>
          <div className='text-xs text-slate-600'>
            Tell us about Yourself to Genrate with AI
          </div>


          <textarea placeholder='what did u do in this role?' className='form-input w-full mt-1' rows={3}
            value={profileData.summary || ""}
            onChange={({ target }) => updateSection('summary', target.value)}

          />

        </div>
      </div>
    </div>
  )
}

export default ProfileInfoForm