import React from "react";
import Footer from "../components/footer/footer";

const BlackListGuard = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-10 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[50%]">
          <p className=" font-bold text-3xl mb-10 text-center">
            ADD BLACKLISTED GUARD
          </p>
          <div className=" md:flex w-full gap-8 ">
            <div className=" w-full">
              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="Name"
                />
              </div>
              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="Gender: Male / Female"
                />
              </div>

              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="PSIRA / SOB Number"
                />
              </div>
              <div className=" w-full">
                <select className=" bg-white p-3 my-2 w-[100%]">
                  <option>Select Reason</option>
                  <option>Dismissed</option>
                  <option>Absconded</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className=" w-full">
              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="Surname"
                />
              </div>
              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="ID Number"
                />
              </div>
              <div className=" w-full">
                <input type="date" className=" bg-white p-3 my-2 w-[100%]" />
              </div>

              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="Description"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full gap-8 my-2 p-3">
            <div className=" w-1/2">
              <p className=" text-wrap">
                Has the Guard signed an acceptance letter
              </p>
              <div className="flex">
                <input type="radio" />
                <p className=" ml-3">Yes</p>
              </div>
            </div>
            <div className=" w-1/2">
              <p>Upload Letter</p>
              <input type="file" />
            </div>
          </div>
          <textarea placeholder="other" className=" w-full bg-white p-3" />

          <div className=" flex flex-col md:flex-row justify-center w-[40%] md:w-full mt-6">
            <div className=" flex flex-col ">
              <button className="bg-[#167BA9] rounded-xl text-white font-normal p-3 px-3 my-2 ">
                SUBMIT NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlackListGuard;
