import React, { createContext, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
    const {user,clearUser} = useContext(UserContext);
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/')
    };
  return (
  user && (
    <div className='flex items-center'>
        <div>
            <div className='text-[15px] font-bold leading-3'>{user.name || ''}</div>
            <button 
            className='text-blue-900 text-sm font-semibold cursor-pointer hover:underline'
            onClick={handleLogout}
            >
                Logout
            </button>
        </div>
        
    </div>
  )
)
}

export default ProfileInfoCard