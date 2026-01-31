import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import Input from '../../componets/inputs/Input'
import ProfilePhotoSelector from '../../componets/inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/ApiPaths'
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/UploadImage'
import toast from 'react-hot-toast'

const SignUp = ({setCurrentPage}) => {
  const [profilepic,setProfilePic]=useState(null)
  const [fullName,setFullName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)

  const {updateUser} = useContext(UserContext);
  const navigate=useNavigate();

  //handle Signup from submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl="";
    if (!fullName) {
      setError("please enter full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("please enter a valid password.");
      return;
    }

    setError("")

    //sign up api call

    try{

      setLoading(true);

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name : fullName,
        email,
        password,
        profileImageUrl,
      });

      const {token} = response.data

      if (token){
        setLoading(false)
        localStorage.setItem("token",token);
        updateUser(response.data)
        navigate("/dashboard");
        toast('Login successfully')
      }
    }catch(error){
      if (error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went wrong , pls try again");
      }
    }
  }

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center border border-gray-300 '>
      <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-[5px]mb-6 '>Join us today by entering your details below.</p>

      <form onSubmit={handleSignUp}>

        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
          value={fullName}
          onChange={({target}) => setFullName(target.value)}
          label="full Name"
          placeholder='john doe'
          type='text'
          />
          <Input
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label="Email Address"
          placeholder='john@example.com'
          type='text'
          />
          <Input
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder='Enter password'
          type='password'
          />
        </div>
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>
          Sign up
        </button>
        <p className='text-[13px] text-slate-800 mt-3'>Already an account?{" "}
          <button className='font-medium text-blue-800 underline cursor-pointer' onClick={()=>{
            setCurrentPage("login")
          }}>Login</button>
        </p>
      </form>
    </div>
  )
}

export default SignUp