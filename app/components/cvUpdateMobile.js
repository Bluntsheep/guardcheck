import React from "react";
import { FaRegCopy } from "react-icons/fa";

const CvUpdatemobile = () => {
  return (
    <div className=" flex md:hidden bg-[#FAFAFA] w-100%">
      <div className=" w-90% p-3 w-full">
        <div className="flex bg-[#167BA9] justify-around p-5">
          <div className=" bg-white p-8 rounded-full">
            <FaRegCopy color="grey" size={50} />
          </div>
          <div className="flex flex-col justify-center text-center text-white font-bold text-2xl ">
            <p>SUBMIT</p>
            <p>SECURITY</p>
            <p>GUARD CV</p>
          </div>
        </div>
        <div>
          <div className=" w-full mx-8">
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="Name"
            />
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="Surname"
            />
          </div>
          <div className="w-full mx-8">
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="Id Number"
            />
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="PSIR / SOB Number"
            />
          </div>
          <div className="w-full mx-8">
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="Phone"
            />
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="Region"
            />
          </div>
          <div className="w-full mx-8">
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="Town"
            />
            <input
              className=" w-[80%] mt-3 bg-slate-200 p-3 text-lg"
              placeholder="Select Highest Grade"
            />
          </div>
          <div className="flex w-full mt-5 gap-8 justify-center text-xs">
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
          <div className="flex gap-8 mt-5 justify-center">
            <textarea
              className=" w-[90%] bg-slate-200 p-3"
              rows={5}
              placeholder="Personal Experience"
            />
          </div>
          <div className=" text-xs mt-5 pl-3">
            <p>Guard Type:</p>
          </div>
          <div className="text-xs px-5 mt-5 flex gap-2 justify-around">
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
          <div className=" w-full items-center">
            <button className="bg-[#167BA9] text-white p-3 mt-8 rounded-md w-[30%] text-center justify-center self-center">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvUpdatemobile;
