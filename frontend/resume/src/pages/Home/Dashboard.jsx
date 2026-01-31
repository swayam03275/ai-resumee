import React, { useEffect, useState } from 'react'
import ProfileInfoCard from '../../componets/cards/profileInfoCard'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import DashboardLayout from '../../componets/layouts/DashboardLayout';
import { LuCirclePlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import ResumeSummaryCard from '../../componets/cards/ResumeSummaryCard';
import CreateResumeForm from './CreateResumeForm';
import Modal from '../../componets/Modal';


const Dashboard = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState(null);
  const navigate = useNavigate();

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    } catch (error) {
      console.error("error in fetching resumes", error);

    }
  }

  useEffect(() => {
    fetchAllResumes();
  }, [])
  return (

    <DashboardLayout >
      <div className=''>

      
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0 '>
        <div className='h-[300px] flex flex-col gap-5 items-center justify-center backdrop-blur-[22px]  rounded-lg border border-purple-100 hover:border-purple-400  cursor-pointer' onClick={() => setOpenCreateModal(true)}>
          <div className='w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl'>
            <LuCirclePlus className='text-xl text-black-500 ' />
          </div>
          <h3 className='font-medium text-gray-800 '>Add New resume</h3>
        </div>
        {
          allResumes?.map((resume) => (
            <ResumeSummaryCard

              key={resume?._id}
              imgUrl={resume?.thumbnailLink || null}
              title={resume.title}
              lastUpdated={
                resume?.updatedAt
                  ? moment(resume.updatedAt).format('Do MMM YYYY')
                  : ''
              }
              onSelect={() => navigate(`/resume/${resume?._id}`)}
            />

          ))
        }
      </div>

      <Modal isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false)
        }}
        hideHeader
      >
        <div className=''>
          <CreateResumeForm />
        </div>
      </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard