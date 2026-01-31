import React from "react";

const CertificationInfo = ({ title, issuer, year, bgColor }) => {
  return (
    <div className="">
      <div className="flex justify-between">
<h3 className="text-[15px] font-semibold ">{title}</h3>
<div className="flex items-center ">
        {year && (
          <div
            className="text-[11px] font-bold  px-3 py-0.5 inline-block mt-2 rounded-lg"
          >
            {year}
          </div>
        )}
      </div>
      </div>
      
      
      <p className="text-[12px] font-medium ">{issuer}</p>
    </div>
  );
};

export default CertificationInfo;
