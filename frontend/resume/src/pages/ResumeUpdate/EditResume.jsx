import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../componets/layouts/DashboardLayout';
import { useReactToPrint } from 'react-to-print'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/ApiPaths';
import TitleInput from '../../componets/inputs/TitleInput';
import { LuArrowLeft, LuArrowRight, LuBrain, LuCircleAlert, LuDownload, LuPalette, LuSave, LuTrash } from 'react-icons/lu';
import StepProgress from '../../componets/StepProgress';
import ProfileInfoForm from './Forms/ProfileInfoForm';
import ContactInfoForm from './Forms/ContactInfoForm';
import WorkExperienceForm from './Forms/WorkExperienceForm';
import EducationDetailForm from './Forms/EducationDetailForm';
import SkillsInfoForm from './Forms/SkillsInfoForm';
import ProjectsDetailForm from './Forms/ProjectsDetailForm';
import CertificateInfoForm from './Forms/CertificateInfoForm';
import RenderResume from '../../componets/ResumeTemplates/RenderResume';
import { dataURLtoFile, fixTailwindColors } from '../../utils/helper';
import { Toaster, toast } from "react-hot-toast"
import Modal from '../../componets/Modal';
import ThemeSelector from './ThemeSelector';
import { URL } from '../../AI/AI';
import { AiOutlineLoading } from "react-icons/ai";

const EditResume = () => {
  const { resumeId } = useParams()
  const navigate = useNavigate();

  const resumeRef = useRef(null)
  const resumeDownloadRef = useRef(null);

  const [basewidth, setBaseWidth] = useState(800);

  const [openThemeSelector, setOpenThemeSelector] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [openAIReview, setOpenAIReview] = useState(false)

  const [currentPage, setCurrentPage] = useState('profile-info')
  const [aiData, setAiData] = useState(null)
  const [resumeData, setResumeData] = useState({
    title: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: ""
      },
    ],
    skills:
    {
      name: "",
      prof:"",
    },

    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      }
    ],
  });
  console.log(resumeData);


  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  //validate inputs
  const validateAndNext = (e) => {
    const errors = [];

    switch (currentPage) {
      case "profile-info": {
        const { fullName, designation } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full name is required");
        if (!designation.trim()) errors.push("Designaition is required");
        break;
      }

      case "contact-info": {
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
          errors.push("Valid email is required.");
        if (!phone.trim())
          errors.push("Valid 10-digit phone number is required");
        break;
      }

      case "skills": {
        const { name } = resumeData.skills;
        if (!name.trim()) errors.push("Skills is reqd")
        break;
      }

      case "work-experience":
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company.trim())
              errors.push(`Company is required in experience ${index + 1}`);
            if (!role.trim())
              errors.push(`Role is required in experience ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(`Start and End dates are required in experience ${index + 1}`);
          }
        );
        break;

      case "education-info":
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim())
              errors.push(`Degree is required in education ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required in education ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(`Start and End dates are required in education ${index + 1}`);
          }
        );
        break;



      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim())
            errors.push(`Project title is required in project ${index + 1}`);
          if (!description.trim())
            errors.push(`Project description is required in project ${index + 1}`);
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim())
            errors.push(`Certification title is required in certification ${index + 1}`);
          if (!issuer.trim())
            errors.push(`Issuer is required in certification ${index + 1}`);
        });
        break;

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    //move to next step
    setErrorMsg("");
    goToNextStep();

  };

  //function to navigate to the next page
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "skills",
      "work-experience",
      "education-info",
      "projects",
      "certifications",

    ];

    if (currentPage === "certifications") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    const nextIndex = currentIndex + 1;
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      setCurrentPage(pages[nextIndex]);

      //set progress as percnetage
    }
  };

  //function to navigate to the previous page
  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "skills",
      "work-experience",
      "education-info",
      "projects",
      "certifications",

    ];
    if (currentPage === "profile-info") navigate("/dashboard")

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex])
    }

    //set progress as percnetage
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection('profileInfo', key, value);
            }}
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => {
              updateSection("contactInfo", key, value);
            }}
          />
        )

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItems={(index, key, value) => {
              updateArrayItems("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
          />
        )

      case "education-info":
        return (
          <EducationDetailForm
            educationInfo={resumeData?.education}
            updateArrayItems={(index, key, value) => {
              updateArrayItems("education", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        )
      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateSection={(key, value) => updateSection("skills", key, value)}
          />

        )
      case "projects":
        return (
          <ProjectsDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItems={(index, key, value) => {
              updateArrayItems("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        )
      case "certifications":
        return (
          <CertificateInfoForm
            certificateInfo={resumeData?.certifications}
            updateArrayItems={(index, key, value) => {
              updateArrayItems("certifications", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        )
      default:
        return null;
    };
  };

  //update simple nested object (like profileinfo , contact info etc.)
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  };

  //update array item like workexp[0] , sills , etc
  const updateArrayItems = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value;  //for simple strings like in interests
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        }
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  //add items to array 
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  }

  //remove items from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    })
  }

  //fetch resume info by id
  const fetchResumeInfoById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || 'untitled',
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience: resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications: resumeInfo?.certifications || prevState?.certifications,
        }))
      }
    } catch (error) {
      console.error('error in fetching resume', error)
    }
  }

  //upload thumbnail and resume profile img
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);
      // Directly update resume details, no image upload
      await updateResumeDetails();
      toast.success("Resume Updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("error updating resume", error);
      toast.error("failed to update resume");
    } finally {
      setIsLoading(false);
    }
  }

  const updateResumeDetails = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        {
          ...resumeData,
        }
      );
    } catch (err) {
      console.error("Error capturing image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  //delete reusme
  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success('resume deleted successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error("error capturing image", error)
    } finally {
      setIsLoading(false);
    }
  }


  //download resume
  const reactToPrintFn = useReactToPrint({ contentRef: resumeDownloadRef });

  //fxn to update basewith based on the resume container size
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth)
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);

    if (resumeId) {
      fetchResumeInfoById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth)
    }
  }, [])

  const Prompt = {
    contents: [
      {
        parts: [
          {
            text: `
You are an ATS system evaluator. Analyze the following resume data in JSON format and return:

1. A resume score from 0 to 10 (use decimal like 8.5, not a whole number).
2. A list of improvement suggestions in bullet point array form (max 8 tips).
3. Focus on structure, keywords, formatting, typos, and ATS friendliness.

Return result in JSON format like:
{
  "ats_score": <score>,
  "improvements": [ ... ]
}
  dont add json before and after the result

Here is the resume data:
${JSON.stringify(resumeData)}
          `
          }
        ]
      }
    ]
  }

  const handleAiReview = async () => {
    setIsLoading(true)
    setOpenPreviewModal(true)
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
        if (aiText) {
          try {
            const cleaned = aiText
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim();
            const parsed = JSON.parse(cleaned);
            setAiData(parsed);
            setIsLoading(false);
          } catch (e) {
            console.error("Failed to parse AI response as JSON:", aiText, e);
            setAiData(null);
          }
        }
      } else {
        console.error("AI response format unexpected:", data);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };
  console.log(aiData);


  return (
    <DashboardLayout>
      <div><Toaster /></div>
      <div className=' mx-auto'>
        <div className='flex items-center justify-between gap-5 backdrop-blur-[22px] rounded-lg border border-gray-100 py-3 px-4 mb-4  '>
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
            }
          />

          <div className='flex items-center gap-4'>


            <button className='btn-small-light ' onClick={handleDeleteResume}>
              <LuTrash className='text-[16px]' />
              <span className='hidden md:block'>Delete</span>
            </button>

            <button className='btn-small-light' onClick={() => setOpenPreviewModal(true)}>
              <LuBrain className='text-[16px]' />
              <span className='hidden md:block'>Get AI Review</span>
            </button>

            <button className='btn-small-light ' onClick={handleAiReview}>
              <LuDownload className='text-[16px]' />
              <span className='hidden md:block'>Preview and download</span>
            </button>


          </div>
        </div>

        <div className='grid grid-cols-1  md:grid-cols-2 gap-5'>
          <div className='rounded-lg border backdrop-blur-[22px]  border-purple-100 overflow-hidden '>

            <StepProgress progress={90} />
            {renderForm()}

            <div className='mx-5'>
              {errorMsg && (
                <div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded-lg'>
                  <LuCircleAlert className='text-md' /> {errorMsg}
                </div>
              )}

              <div className='flex items-end justify-end gap-3 mt-3 mb-5'>
                <button className='btn-small-light' onClick={goBack} disabled={isLoading}>
                  <LuArrowLeft className='text-[16px]' />
                  Back
                </button>
                <button className='btn-small-light' onClick={uploadResumeImages} disabled={isLoading}>
                  <LuSave className='text-[16px]' />
                  {isLoading ? "updating..." : "save and exit"}
                </button>
                <button className='btn-small' onClick={validateAndNext} disabled={isLoading}>
                  {currentPage === 'certifications' && (
                    <LuDownload className='text-[16px]' />
                  )}
                  {currentPage === 'certifications' ? "preview and downlaod" : "next"}
                  {currentPage !== 'certifications' && (
                    <LuArrowRight className='text-[16px]' />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div ref={resumeRef} className='h-[100vh]'>
            {/* reusme template */}
            <RenderResume
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              containerWidth={basewidth}
            />
          </div>
        </div>
      </div>





      <Modal
  isOpen={openPreviewModal}
  onClose={() => setOpenPreviewModal(false)}
  title={resumeData.title}
  description="Use Save as PDF option not Microsoft to PDF"
  showActionBtn
  actionBtnText="Download"
  actionBtnIcon={<LuDownload className="text-[16px]" />}
  onActionClick={() => reactToPrintFn()}
>
  <div className="flex flex-col md:flex-row gap-4 w-full max-h-[90vh] overflow-auto p-2">
    {/* AI Review */}
    <div className="w-full md:w-80 bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 text-gray-800">AI Resume Review</h2>

      {aiData ? (
        <>
          <div className="flex flex-col items-center mb-4 w-full">
            <span className="text-sm text-gray-500">ATS Score</span>
            <div className="text-4xl font-extrabold text-green-600 mb-1">{aiData.ats_score ?? '--'}</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${(aiData.ats_score / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-md font-semibold mb-2 text-gray-700">Improvements</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
              {aiData.improvements?.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center"><AiOutlineLoading className='animate-spin text-2xl' /></div>
      )}
    </div>

    {/* Resume Preview */}
    <div
      ref={resumeDownloadRef}
      className="relative bg-white resume-print w-full md:w-[210mm] min-h-[297mm] mx-auto"
    >
      <RenderResume
        templateId={resumeData?.template?.theme || ""}
        resumeData={resumeData}
        colorPalette={resumeData?.template?.colorPalette || []}
      />
    </div>
  </div>
</Modal>


    </DashboardLayout>
  )
}


export default EditResume