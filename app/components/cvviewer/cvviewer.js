import React from "react";

const Cvviewer = ({ currentCV, handleCV }) => {
  const cv = currentCV;

  console.log(cv);

  return (
    <div>
      <div className=" flex justify-center">
        <div className=" w-[60%]">
          <div>
            <p className=" text-5xl text-slate-600 font-bold mb-4">{cv.name}</p>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Name</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.name}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Surname</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.surname}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Gender</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.gender}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">ID Number</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.idNumber}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Sira / Sob No</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.siraNumber}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Phone Number</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2">{cv.phone}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2  ">Province</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.area}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Town</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.town}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Highest Grade</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2">{cv.grade}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">Guard Type</p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.guardType}</p>
            </div>
          </div>
          <div className=" flex justify-center w-full">
            <div className="w-2/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-800 font-bold p-2 ">
                Previous Experience
              </p>
            </div>
            <div className=" w-10/12 text-left  border-slate-200 border-[1px]">
              <p className="  text-slate-500 p-2 ">{cv.experience}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleCV("")}
        className="bg-[#14A2B8] rounded-md text-white font-normal p-2 px-3 mt-2 ">
        Back
      </button>
    </div>
  );
};

export default Cvviewer;
