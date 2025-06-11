import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";

const page = () => {
  return (
    <div>
      <Menubar />
      <div className="flex flex-col items-center justify-center py-18 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-10 my-5 w-[40%]">
          <p className=" font-bold text-3xl mb-10">LOGIN HERE</p>

          <div className=" w-full">
            <input
              className=" bg-white p-3 my-2 w-[100%]"
              placeholder="Username"
            />
          </div>
          <div className=" w-full">
            <input
              className=" bg-white p-3 my-2 w-[100%]"
              placeholder="Enter Password"
            />
          </div>
          <div className=" flex justify-between w-full mt-4">
            <div className=" flex flex-col ">
              <button className="bg-[#167BA9] rounded-2xl text-white p-2 my-2 ">
                Login Now
              </button>
              <div className="mt-3">
                <label>
                  <input type="checkbox" />
                  <span className="ml-3 ">Remember Me</span>
                </label>
              </div>
            </div>
            <div className=" flex-grow" />
            <div className=" text-[#14A2B8]">
              <div className=" ">
                <p>Forgot Password?</p>
              </div>
              <div className="mt-4">
                <p>Forgot Username?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default page;
