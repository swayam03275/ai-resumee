const fs = require("node:fs");
const path = require("node:path");
const Resume = require("../models/Resume")

//@desc create a new resume
//@route post /api/resume
//@access private

const createResume = async (req,res) => {
    try{

        const {title}=req.body;

        //default template
        const defaultResumeData = {
            profileInfo:{
                profileImg:null,
                previewUrl:"",
                fullName:"",
                designation:"",
                summary:"",
            },
            contactInfo:{
                email:"",
                phone:"",
                location:"",
                linkedin:"",
                github:"",
                website:"",
            },
            workExperience:[
                {company:"",
                  role:"",
                  startDate:"",
                  endDate:"",
                  description:"",
                },
            ],
            education:[
                {
                    degree:"",
                    institution:"",
                    startDate:"",
                    endDate:"",
                },
            ],
            skills:
                {
                    name:"",
                    prof:""

                },
            
            projects:[
                {
                    title:"",
                    description:"",
                    github:"",
                    liveDemo:"",
                },
            ],
            certifications:[
                {
                    title:"",
                    issuer:"",
                    year:"",
                },
            ],
        };

        const newResume = await Resume.create({
            userId:req.user._id,
            title,
            ...defaultResumeData,
        });

        res.status(201).json(newResume);
        } catch (error){
        res
        .status(500)
        .json({message: "Failed to create resume",error:error.message});
    }
};

//@desc get all resume for logged-in user
//@route get/api/resumes
//@access private
const getUserResumes = async(req,res) => {
    try {
        const resumes = await Resume.find({userId: req.user._id}).sort({
            updatedAt:-1,
        })
        res.json(resumes);
    } catch (error) {
        res
        .status(500)
        .json({message: "Failed to create resume",error:error.message});
    }
};

//@desc get single resume by id 
//@route get /api/rsumes/:id
//@access private
const getResumeById=async (req,res) => {
    try {
       const resume = await Resume.findOne({_id: req.params.id,userId:req.user._id});

       if(!resume){
        return res.status(404).json({message:"Resume not found"});
       }

       res.json(resume);
    } catch (error) {
        res
        .status(500)
        .json({message: "Failed to create resume",error:error.message});
    }
}

//@desc update a resume
//@route put /api/resumes/:id
//@access private
const updateResume = async (req,res) => {
    try {
       const resume=await Resume.findOne({
        _id:req.params.id,
        userId:req.user._id,
       });

       if (!resume){
        return res.status(404).json({message:"Resume not found or unauthorized"})
       }

       //merge updates form req.body into existing resume
       Object.assign(resume,req.body);

       //save update resume
       const savedResume = await resume.save();

       res.json(savedResume);
    } catch (error) {
        res
        .status(500)
        .json({message: "Failed to create resume",error:error.message});
    }
};

//@desc delete a resume
//@route delete /api/resumes/:id
//@access private
const deleteResume= async (req,res)=> {
    try {
       const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id,
       })

       if(!resume){
        return res.status(404).json({message:"Resume not found or unauthorized"});
       }

       //delete thumbnaillink and professionaUrl images from the uploads folder
       const uploadsFolder = path.join(__dirname,'..','uploads');
       const baseUrl = `${req.protocol}://${req.get("host")}`;

       if (resume.thumbnailLink){
        const oldThumbnail=path.join(uploadsFolder,path.basename(resume.thumbnailLink));
        if(fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
       }

       if(resume.profileInfo?.profilePreviewUrl){
        const oldProfile = path.join(uploadsFolder,path.basename(resume.profileInfo.profilePreviewUrl));
        if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile)
       }

       const deleted = await Resume.findOneAndDelete({
        _id: req.params.id,
        userId:req.user._id,
       });

       if (!deleted) {
        return res.status(404).json({message:"Resume not found or unauthorized"})
       }

       res.json({message:"resume deleted successfull"})
    } catch (error) {
        res
        .status(500)
        .json({message: "Failed to create resume",error:error.message});
    }
};

module.exports={
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
};
