"use client";

import React, { useState } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";
import GuardTable from "../components/viewcvComponent";
import Cvviewer from "../components/cvviewer/cvviewer";
import { ChevronDown } from "lucide-react";

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

  const provinces = [
    { value: "", label: "Select Region" },
    { value: "EC", label: "Eastern Cape" },
    { value: "FS", label: "Free State" },
    { value: "GP", label: "Gauteng" },
    { value: "KZN", label: "KwaZulu-Natal" },
    { value: "MP", label: "Mpumalanga" },
    { value: "NC", label: "Northern Cape" },
    { value: "LP", label: "Limpopo" },
    { value: "NWP", label: "North West Province" },
    { value: "WC", label: "Western Cape" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:py-16 lg:py-28">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 lg:mb-8 text-gray-800">
              VIEW CV
            </h1>

            {/* Province Selector */}
            <div className="flex justify-center mb-6">
              <div className="relative w-full max-w-md lg:w-[50%]">
                <select
                  onChange={(e) => handleChange(e.target.value)}
                  value={province}
                  className="shadow-xl bg-white w-full p-4 lg:p-6 pr-12 rounded-lg appearance-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14A2B8] focus:border-transparent text-gray-700">
                  {provinces.map((prov) => (
                    <option key={prov.value} value={prov.value}>
                      {prov.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status Message */}
            <div className="mb-8">
              <p className="font-medium text-slate-700 text-sm sm:text-base">
                {!province ? (
                  <span className="text-gray-500">
                    Please select a region to view CVs
                  </span>
                ) : (
                  <span className="text-[#14A2B8]">
                    Showing CVs for{" "}
                    {provinces.find((p) => p.value === province)?.label}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm min-h-[400px]">
            {!currentCV ? (
              <div className="p-4 lg:p-6">
                {province ? (
                  <GuardTable province={province} handleCV={handleCV} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium mb-2">
                      No region selected
                    </p>
                    <p className="text-sm text-center max-w-sm">
                      Please select a region from the dropdown above to view
                      available CVs
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-0">
                <Cvviewer currentCV={currentCV} handleCV={handleCV} />
              </div>
            )}
          </div>

          {/* Back Button - Only show when not viewing a CV */}
          {!currentCV && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleBack}
                className="bg-[#14A2B8] rounded-md text-white font-normal p-3 px-6 lg:p-2 lg:px-3 hover:bg-[#0f8a9e] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                Back
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewCv;
