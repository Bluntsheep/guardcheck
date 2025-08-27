"use client";

import React, { useState, useEffect } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import {
  FaUsers,
  FaFileAlt,
  FaUserShield,
  FaUserTie,
  FaEnvelope,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
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
    router.push(`/adminDashboard/${route}`);
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
    <div className="bg-[#FFFFFF]">
      <div className="my-[3%] cursor-default align-middle justify-center object-center">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#12114A] mb-4">
            ADMIN DASHBOARD
          </h1>
          <p className="text-gray-600">Manage your system components</p>
        </div>

        {/* First Row */}
        <div className="flex-wrap md:flex text-center md:my-3 p-3 gap-10 justify-center md:px-[5%]">
          <div className="flex gap-6 bg-white p-8 md:w-3/12 shadow-md items-center mt-8 hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-100">
            <div>
              <FaUsers color="#167BA9" size={50} />
            </div>
            <div
              onClick={() => handleClick("userprofiles")}
              className="cursor-pointer">
              <p className="font-bold text-xl hover:text-red-600 text-[#12114A] transition-colors duration-200">
                Users
              </p>
              <p className="text-wrap text-left text-slate-500 mt-1">
                Manage user accounts and permissions
              </p>
            </div>
          </div>

          <div className="flex gap-6 bg-white p-8 md:w-3/12 shadow-md items-center mt-8 hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-100">
            <div>
              <FaFileAlt color="#167BA9" size={50} />
            </div>
            <div onClick={() => handleClick("cvs")} className="cursor-pointer">
              <p className="font-bold text-xl hover:text-red-600 text-[#12114A] transition-colors duration-200">
                {`CV's`}
              </p>
              <p className="text-wrap text-left text-slate-500 mt-1">
                Review and manage curriculum vitae
              </p>
            </div>
          </div>

          <div className="flex gap-6 bg-white p-8 md:w-3/12 shadow-md items-center mt-8 hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-100">
            <div>
              <FaUserShield color="#167BA9" size={50} />
            </div>
            <div
              onClick={() => handleClick("unblacklistadmin")}
              className="cursor-pointer">
              <p className="font-bold text-xl hover:text-red-600 text-[#12114A] transition-colors duration-200">
                Guards
              </p>
              <p className="text-wrap text-left text-slate-500 mt-1">
                Manage security guard records
              </p>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex-wrap md:flex text-center md:my-3 p-3 gap-10 justify-center md:px-[5%]">
          <div className="flex gap-6 bg-white p-8 md:w-3/12 shadow-md items-center mt-8 hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-100">
            <div>
              <FaUserTie color="#167BA9" size={50} />
            </div>
            <div
              onClick={() => handleClick("member")}
              className="cursor-pointer">
              <p className="font-bold text-xl hover:text-red-600 text-[#12114A] transition-colors duration-200">
                Member Profiles
              </p>
              <p className="text-wrap text-left text-slate-500 mt-1">
                View and edit member information
              </p>
            </div>
          </div>

          <div className="flex gap-6 bg-white p-8 md:w-3/12 shadow-md items-center mt-8 hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-100">
            <div>
              <FaEnvelope color="#167BA9" size={50} />
            </div>
            <div
              onClick={() => handleClick("sendMail")}
              className="cursor-pointer">
              <p className="font-bold text-xl hover:text-red-600 text-[#12114A] transition-colors duration-200">
                Emails
              </p>
              <p className="text-wrap text-left text-slate-500 mt-1">
                Manage email communications
              </p>
            </div>
          </div>

          {/* Empty placeholder for symmetry */}
          <div className="md:w-3/12 mt-8 hidden md:block">
            {/* Empty space for layout balance */}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center w-full mt-12">
          <button
            onClick={() => handleClick("dashboard")}
            className="bg-[#14A2B8] rounded-md text-white font-normal p-3 px-8 hover:bg-[#0f8a9e] transition-colors duration-200 shadow-md">
            Back to Main Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
