import React from "react";

const EducationInfo = ({ degree, institution, duration }) => {
  return (
    <div className="">
      <div className="flex justify-between">
         <h3 className="text-[15px] font-semibold text-gray-900">{degree}</h3>
        <p className="text-sm font-semibold">
        {duration}
      </p>
      </div>
     
      <p className="text-sm font-medium">{institution}</p>
      
    </div>
  );
};

export default EducationInfo;
