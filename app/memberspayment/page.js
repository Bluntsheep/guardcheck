import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";

const Memberspayment = () => {
  return (
    <div>
      <Menubar />
      <div className=" text-center my-28">
        <p className=" text-5xl font-bold">Welcome to Guard Check:</p>
        <p className=" text-slate-500 mt-6 text-lg">
          In order to use Guard Check Services please subscribe
        </p>
        <p className=" text-slate-500 mt-6 text-lg">
          Subscription is a yearly fee of R 2850.00
        </p>
        <div className="flex justify-center gap-8 w-full mt-6">
          <button className="bg-[#14A2B8] rounded-l text-white font-normal p-2 px-3 mt-2 ">
            Subscribe
          </button>
          <button className="bg-[#14A2B8] rounded-l text-white font-normal p-2 px-3 mt-2 ">
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Memberspayment;
