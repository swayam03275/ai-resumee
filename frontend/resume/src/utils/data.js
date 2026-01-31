import TEMPLATE_ONE_IMG from '../assets/template-one.png';
import TEMPLATE_TWO_IMG from '../assets/template-two.png';
import TEMPLATE_THREE_IMG from '../assets/template-three.png';

export const resumeTemplates = [
  {
    id: '01',
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: 'themeOne'
  },
  {
    id: '02',
    thumbnailImg: TEMPLATE_TWO_IMG,
    colorPaletteCode: 'themeTwo'
  },
  {
    id: '03',
    thumbnailImg: TEMPLATE_THREE_IMG,
    colorPaletteCode: 'themeThree'
  },
];

export const themeColorPalette = {
  themeOne: [
    ["#EBFDF1", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"],
    ["#E9F8F8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
    ["#F5F4FF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFD6FF", "#3399FF", "#445361"],
    ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CF5", "#2D3748"],
    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C79D", "#384C48"],
  ]
}
export const DUMMY_RESUME_DATA = {
  profileInfo: {
    profileImg: null,
    previewUrl: "",
    fullName: "John Doe",
    designation: "Senior Software Engineer",
    summary: "Passionate and results-driven developer with 6+ years of experience building"
  },
  contactInfo: {
    email: "john.doe@example.com",
    phone: "+1234567890",
    location: "#12 Anywhere, Any City, Any Country",
    linkedin: "https://linkedin.com/timetoprogram",
    github: "https://github.com/timetoprogram",
    website: "https://timetoprogram.com"
  },
 workExperience: [
    {
        company:"tech soultions",
        role: "senior frontend developer",
        startDate : "2023-2",
        endData : "2025-2",
        description:"work on lot of things"
    },
 ],
 education:[
    {
        degree:"btech",
        institution:"abc college",
        startDate : "2023-2",
        endData : "2025-2",
    }
 ],
 skills:[
    {name: "javascript" , progress : 95},
 ],
 projects:[
    {
        title : "resuem builder",
        description:"asjdfaskjdfhasdkfjh",
        github:"asdfkajsdaslkdjf"
    }
 ],
certifications: [
    {title: "full stack web developer",
        issuer:"meta",
        year:"2025",
    },
]
};