import React from "react";

const WorkExperience = ({
  company,
  role,
  duration,
  durationColor,
  description,
}) => {
  return (
    <div className="mb-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[19px] font-semibold text-black">
            {company}
          </h3>
          <p className="text-[15px] text-black font-medium">{role}</p>
        </div>
        <p className="text-sm font-bold ">
          {duration}
        </p>
      </div>
      <p className=" text-black font-medium  mt-[0.2cqw]">
        {description}
      </p>
    </div>
  );
};

export default WorkExperience;
