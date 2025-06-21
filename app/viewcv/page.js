import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";

const ViewCv = () => {
  return (
    <div>
      <Menubar />
      <div className=" text-center my-28">
        <p className=" text-5xl font-bold mb-8">VIEW CV</p>
        <select className=" shadow-xl bg-white w-[50%] p-6">
          <option>Select Region</option>
          <option>Eastern Cape</option>
          <option>Free State</option>
          <option>Gauteng</option>
          <option>Kwazulu-Natal</option>
          <option>Mpumalanga</option>
          <option>Northan Cape</option>
          <option>Limpopo</option>
          <option>North West Province</option>
          <option>Western Cape</option>
        </select>
        <p className=" my-8 font-medium text-slate-700">No records found.</p>
        <div className="flex justify-center gap-8 w-full mt-6">
          <button className="bg-[#14A2B8] rounded-md text-white font-normal p-2 px-3 mt-2 ">
            Back
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewCv;
