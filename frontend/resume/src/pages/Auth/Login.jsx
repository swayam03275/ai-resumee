import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../componets/inputs/Input'
import { validateEmail } from '../../utils/helper'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/ApiPaths'

const Login = ({setCurrentPage}) => {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState(null)
  const [laoding,setLoading]=useState(false)

 const {updateUser} = useContext(UserContext)
  const navigate = useNavigate()

  //handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("plese enter a valid email")
      return;
    }
    if (!password){
      setError("please enter the pasword")
      return;
    }

    setError("");

    //login api call
    try{
      setLoading(true)
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN , {
          email,
          password,
        });

        const {token} =response.data;
        setLoading(false)
        updateUser(response.data)
        navigate("/dashboard")
    }catch(error){
      setLoading(false)
        if (error.response && error.response.data.message) {
          
          setError(error.response.data.message);
        }
        console.log(error);  
    }
  };
  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center border border-gray-300 '>
        <h3 className='text-lg font-semibold text-black'> Welcome Back </h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your details to log in 
      </p>

      <form action="" onSubmit={handleLogin} className=''>
        <div>
        <Input value={email} onChange={({target}) => setEmail(target.value)} label='Email Address' placeholder='Johndoe@gmail.com' type="text" name="" id="" />

        <Input value={password} onChange={({target}) => setPassword(target.value)} label='password' placeholder='Enter password' type="password" name="" id="" />
        </div>
        

        {error && <p className='text-red-500 text-xs pb-2.5 '>{error}</p>}

        <button disabled={laoding} type='submit'  className='btn-primary'>{laoding? "Logging in..." : "Login"}</button>
        <p className='text-[13px] text-slate-800 mt-3 '>Dont have an account?{" "}
          <button
          
        className='font-medium text-blue-700 underline cursor-pointer'
        onClick={()=> {
          setCurrentPage("signup")
        }}
        >Signup</button></p>
      </form>
    </div>
  )
}

export default Login