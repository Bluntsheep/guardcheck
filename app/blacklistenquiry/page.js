"use client";

import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";

const BlacklistEnquiry = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/payment");
  };

  return (
    <div>
      <div className=" text-center my-28">
        <p className=" text-5xl font-bold mb-8">BLACK LIST ENQUIRY</p>
        <input
          className=" shadow-xl bg-white w-[50%] p-6"
          placeholder="Enter PSIRA / SOB No / or ID "
        />
        <p className=" my-8 font-medium text-slate-700">No records found.</p>
        <div className="flex justify-center gap-8 w-full mt-6">
          <button
            onClick={handleBack}
            className="bg-[#14A2B8] rounded-md text-white font-normal p-2 px-3 mt-2 ">
            Back
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlacklistEnquiry;
