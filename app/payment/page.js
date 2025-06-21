"use client";
import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";

const Payments = () => {
  const router = useRouter();
  const handleLogin = () => {
    router.push("dashboard");
  };

  return (
    <div>
      <Menubar />
      <div className=" text-center my-28">
        <p className=" text-5xl font-bold">Payment:</p>
        <p className=" text-slate-500 mt-6 text-lg">EFT Payment</p>
        <p className=" text-slate-500 mt-4 text-lg">
          Subscription is a yearly fee of R 2850.00
        </p>
        <p className=" text-slate-500 text-lg">
          After subscription, you able to be login.
        </p>
        <p className=" text-[#137AA7] mt-6 text-lg">Guardcheck.com</p>
        <p className=" text-[#137AA7] text-lg">Nedbank</p>
        <p className=" text-[#137AA7] text-lg">Acc No 1311842535</p>
        <p className=" text-slate-500 mt-6 text-lg">
          Please e-mail POP to info@guardcheck.com with your company name as a
          reference
        </p>
        <p className=" text-slate-500 text-lg">
          activate your account within 2 business day.
        </p>
      </div>
      <div className=" my-5 items-center align-middle text-center">
        <button
          onClick={handleLogin}
          className=" p-3 bg-blue-400 font-bold round-lg text-white">
          Login
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Payments;
