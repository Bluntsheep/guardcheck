import React from "react";

const Cvviewer = ({ currentCV, handleCV }) => {
  const cv = currentCV;

  console.log(cv);

  const cvFields = [
    { label: "Name", value: cv.name },
    { label: "Surname", value: cv.surname },
    { label: "Gender", value: cv.gender },
    { label: "ID Number", value: cv.idNumber },
    { label: "Sira / Sob No", value: cv.siraNumber },
    { label: "Phone Number", value: cv.phone },
    { label: "Province", value: cv.area },
    { label: "Town", value: cv.town },
    { label: "Highest Grade", value: cv.grade },
    { label: "Guard Type", value: cv.guardType },
    { label: "Previous Experience", value: cv.experience },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl lg:w-[60%]">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl text-slate-600 font-bold break-words">
              {cv.name}
            </h1>
          </div>

          {/* CV Content */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              {cvFields.map((field, index) => (
                <div key={index} className="flex w-full">
                  <div className="w-2/12 lg:w-3/12 text-left border-slate-200 border-[1px] bg-gray-50">
                    <p className="text-slate-800 font-bold p-3 lg:p-4 text-sm lg:text-base">
                      {field.label}
                    </p>
                  </div>
                  <div className="w-10/12 lg:w-9/12 text-left border-slate-200 border-[1px]">
                    <p className="text-slate-500 p-3 lg:p-4 text-sm lg:text-base break-words">
                      {field.value || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {cvFields.map((field, index) => (
                <div
                  key={index}
                  className={`p-4 ${
                    index !== cvFields.length - 1
                      ? "border-b border-slate-200"
                      : ""
                  }`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <span className="text-slate-800 font-bold text-sm min-w-0">
                      {field.label}:
                    </span>
                    <span className="text-slate-500 text-sm break-words flex-1 sm:text-right">
                      {field.value || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <button
              onClick={() => handleCV("")}
              className="bg-[#14A2B8] rounded-md text-white font-normal p-3 px-6 lg:p-2 lg:px-3 hover:bg-[#0f8a9e] transition-colors touch-manipulation">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cvviewer;
