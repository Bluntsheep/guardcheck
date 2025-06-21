import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";

const ChangePassword = () => {
  return (
    <div>
      <Menubar />{" "}
      <div className="flex flex-col items-center justify-center py-10 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[50%]">
          <p className=" font-bold text-3xl mb-10 text-center">
            Change Password
          </p>
          <div className=" md:flex w-full gap-8 ">
            <div className=" w-full">
              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="Password"
                />
              </div>
              <div className=" w-full">
                <input
                  className=" bg-white p-3 my-2 w-[100%]"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div className=" flex flex-col md:flex-row justify-center w-[40%] md:w-full mt-6">
            <div className=" flex flex-col ">
              <button className="bg-[#167BA9] rounded-xl text-white font-normal p-3 px-3 my-2 ">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
      <Footer />
    </div>
  );
};

export default ChangePassword;
