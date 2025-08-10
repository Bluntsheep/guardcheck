"use client";

import React, { useState, useEffect } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import {
  FaKey,
  FaPen,
  FaThLarge,
  FaUserAltSlash,
  FaUsers,
  FaUserSecret,
} from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This ensures the code only runs on the client-side
    const userRole = sessionStorage.getItem("userRole");
    setRole(userRole);
    setIsLoading(false);

    console.log(userRole);
  }, []);

  const handleClick = (route) => {
    router.push(`/${route}`);
  };

  // Show loading while we check the role
  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF] min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className=" bg-[#FFFFFF]">
      <div className=" my-[3%] cursor-default align-middle justify-center object-center">
        <div className="flex-wrap md:flex text-center md:my-3 p-3 gap-10 justify-center md:px-[5%]">
          <div className=" flex  gap-6 bg-white p-8 md:w-3/12 shadow-md items-center mt-8  hover:shadow-xs">
            <div>
              <FaUserAltSlash color="#167BA9" size={50} />
            </div>
            <div onClick={() => handleClick("blacklistguard")}>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Blacklist Guards
              </p>
            </div>
          </div>
          <div className=" flex gap-6 bg-white p-8 md:w-3/12  shadow-md items-center mt-8 hover:shadow-xs">
            <div>
              <FaUsers color="#167BA9" size={50} />
            </div>
            <div onClick={() => handleClick("unblacklist")}>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Un-Blacklist Guards
              </p>
            </div>
          </div>
          <div className=" flex gap-6 bg-white p-8 md:w-3/12  shadow-md items-center mt-8 hover:shadow-xs">
            <div>
              <FaUserSecret color="#167BA9" size={50} />
            </div>
            <div onClick={() => handleClick("blacklistenquiry")}>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Do a Blacklist Enquiry
              </p>
            </div>
          </div>
        </div>
        <div className="flex-wrap  md:flex text-center md:my-3 p-3 gap-10 justify-center md:px-[5%]">
          <div className=" flex gap-6 bg-white p-8 md:w-3/12  shadow-md items-center mt-8 hover:shadow-xs">
            <div>
              <FaUserSecret color="#167BA9" size={50} />
            </div>
            <a href="/acceptLetterLatest.pdf " download>
              <div>
                <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                  Acceptance Letter
                </p>
                <p className=" text-wrap text-left text-slate-500">
                  Please add this form to your letter of employment
                </p>
              </div>
            </a>
          </div>
          <div className=" flex gap-6 bg-white p-8 md:w-3/12  shadow-md items-center mt-8 hover:shadow-xs">
            <div>
              <FaFileShield color="#167BA9" size={50} />
            </div>
            <div onClick={() => handleClick("viewcv")}>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                View CVs
              </p>
            </div>
          </div>
          <div className=" flex gap-6 bg-white p-8 md:w-3/12  shadow-md items-center mt-8 hover:shadow-xs">
            <div>
              <FaPen color="#167BA9" size={50} />
            </div>
            <div onClick={() => handleClick("updateprofile")}>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Update Profile
              </p>
            </div>
          </div>
        </div>
        {role === "5150" && (
          <div
            className={` flex-wrap  md:flex text-center md:my-3 p-3 gap-10 justify-center md:px-[5%]`}>
            <div onClick={() => handleClick("adminDashboard")}>
              <div className=" flex gap-6 bg-white p-8 shadow-md align-center mt-8  hover:shadow-xs">
                <div>
                  <FaThLarge color="#167BA9" size={50} />
                </div>
                <div>
                  <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                    Admin Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
