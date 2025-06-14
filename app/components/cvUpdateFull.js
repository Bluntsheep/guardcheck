import React from "react";
import { FaRegCopy } from "react-icons/fa";

const CvUpdateFull = () => {
  return (
    <div className=" flex-col items-center justify-center py-3 md:py-12 mt-16 bg-[#FAFAFA] hidden md:flex">
      <div className="flex">
        <div className="flex flex-col items-center justify-center p-3 md:p-32 bg-[#167BA9]">
          <div className=" bg-white p-8 rounded-full">
            <FaRegCopy color="grey" size={100} />
          </div>
          <div className="flex flex-col text-center text-white font-bold text-2xl mt-12">
            <p>SUBMIT</p>
            <p>SECURITY</p>
            <p>GUARD CV</p>
          </div>
        </div>
        <div className="bg-white flex flex-col justify-between px-3">
          <div className="flex gap-8 mx-8">
            <input className=" bg-slate-200 p-3 text-lg" placeholder="Name" />
            <input
              className=" bg-slate-200 p-3 text-lg"
              placeholder="Surname"
            />
          </div>
          <div className="flex gap-8 mx-8">
            <input
              className=" bg-slate-200 p-3 text-lg"
              placeholder="Id Number"
            />
            <input
              className=" bg-slate-200 p-3 text-lg"
              placeholder="PSIR / SOB Number"
            />
          </div>
          <div className="flex gap-8 mx-8">
            <input className=" bg-slate-200 p-3 text-lg" placeholder="Phone" />
            <input className=" bg-slate-200 p-3 text-lg" placeholder="Region" />
          </div>
          <div className="flex gap-8 mx-8">
            <input className=" bg-slate-200 p-3 text-lg" placeholder="Town" />
            <input
              className=" bg-slate-200 p-3 text-lg"
              placeholder="Select Highest Grade"
            />
          </div>
          <div className="flex gap-8 justify-center text-xs">
            <div>
              <label>
                <input type="radio" />
                <span className="ml-2">Male</span>
              </label>
            </div>
            <div>
              <label>
                <input type="radio" />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>
          <div className="flex gap-8 justify-center">
            <textarea
              className=" w-[90%] bg-slate-200 p-3"
              rows={5}
              placeholder="Personal Experience"
            />
          </div>
          <div className=" text-xs pl-3">
            <p>Guard Type:</p>
          </div>
          <div className="text-xs px-5 flex gap-2 justify-around">
            <label className="ml-2">
              <input type="checkbox" name="Security guard" />
              <span className="ml-2">Security guard</span>
            </label>
            <label className="ml-2">
              <input type="checkbox" name="Security guard" />
              <span className="ml-2">Armed response</span>
            </label>
            <label className="ml-2">
              <input type="checkbox" name="Security guard" />
              <span className="ml-2">Control room</span>
            </label>
          </div>
          <button className="bg-[#167BA9] text-white p-3 mt-4 rounded-md w-[30%]  self-center">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CvUpdateFull;
