"use client";

import React, { useState } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";
import GuardTable from "../components/viewcvComponent";
import Cvviewer from "../components/cvviewer/cvviewer";

const ViewCv = () => {
  const router = useRouter();
  const [currentCV, setCurrentCV] = useState();

  const [province, setProvince] = useState("");
  const handleBack = () => {
    router.push("/payment");
  };

  const handleCV = (cv) => {
    console.log(cv);
    setCurrentCV(cv);
  };

  const handleChange = (province) => {
    setProvince(province);
  };

  return (
    <div>
      <div className=" text-center my-28">
        <p className=" text-5xl font-bold mb-8">VIEW CV</p>
        <select
          onChange={(e) => handleChange(e.target.value)}
          className=" shadow-xl bg-white w-[50%] p-6">
          <option value="">Select Region</option>
          <option value="EC">Eastern Cape</option>
          <option value="FS">Free State</option>
          <option value="GP">Gauteng</option>
          <option value="KZN">Kwazulu-Natal</option>
          <option value="MP">Mpumalanga</option>
          <option value="NC">Northan Cape</option>
          <option value="LP">Limpopo</option>
          <option value="NWP">North West Province</option>
          <option value="WC">Western Cape</option>
        </select>
        <p className=" my-8 font-medium text-slate-700">
          {!province ? "No records found." : province}
        </p>

        {!currentCV ? (
          <div>
            {province && <GuardTable province={province} handleCV={handleCV} />}
          </div>
        ) : (
          <Cvviewer currentCV={currentCV} handleCV={handleCV} />
        )}
        <div className="flex justify-center gap-8 w-full mt-6">
          {!currentCV && (
            <button
              onClick={handleBack}
              className="bg-[#14A2B8] rounded-md text-white font-normal p-2 px-3 mt-2 ">
              Back
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewCv;
