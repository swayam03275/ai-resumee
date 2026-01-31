import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from "../../componets/inputs/Input"
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
const CreateResumeForm = () => {
  const [title,setTitle]=useState("")
  const [error,setError]=useState(null);

  const navigate = useNavigate();

  //handle create rusume
  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title){
      setError("please enter resume title");
      return;
    }

    setError("");

    //crete resume api call
    try{
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      })

      if (response.data?._id){
        navigate(`/resume/${response.data?._id}`)
      }
    }catch(e){
      if (e.response && e.response.data.message){
        setError(e.response.data.message)
      }else {
        setError("somthing went wrong . pls try again")
      }
    }
  }
  return (
    <div className='w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center '>
      <h3 className='text-lg font-semibold text-black'>Create new Resume</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-3'>Give your resume a title you can edit it later.</p>
      <form onSubmit={handleCreateResume}>
        <Input
        value={title}
        onChange={({target}) => setTitle(target.value)}
        label='Resume Title'
        placeholder="Eg: Mike's resume"
        type='text'
        />
        {error && <p>{error}</p>}

        <button type='submit' className='btn-primary '>Create button</button>
      </form>
    </div>
  )
}

export default CreateResumeForm