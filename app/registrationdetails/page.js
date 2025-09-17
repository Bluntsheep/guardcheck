"use client";

import Footer from "@/app/components/footer/footer";
import React, { useState } from "react";
import RegSuccess from "../components/registrationsuccess/regsuccess";
import { useRouter } from "next/navigation";

const RegistrationDetails = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Removed the problematic dateValue state and logic
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target;
    const formData = new FormData(form);

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Frontend validation
    const requiredFields = [
      { key: "companyName", label: "Company Name" },
      { key: "contactperson", label: "Contact Person" },
      { key: "email", label: "Email" },
      { key: "username", label: "Username" },
      { key: "apass", label: "Password" },
      { key: "cpass", label: "Confirm Password" },
    ];

    for (const field of requiredFields) {
      if (!formObject[field.key] || formObject[field.key].trim() === "") {
        setError(`${field.label} is required`);
        setIsLoading(false);
        return;
      }
    }

    // Check if passwords match
    if (formObject.apass !== formObject.cpass) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Check password length
    if (formObject.apass.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const data = await response.json();

      if (response.ok) {
        RegSuccess(formObject.username);
        sessionStorage.setItem("userName", data.user.username);
        sessionStorage.setItem("userActive", data.user.active);
        sessionStorage.setItem("userId", data.user.id);
        window.dispatchEvent(new Event("authStateChanged"));
        router.push("/payment");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Frontend registration error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-10 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[50%]">
          <p className="font-bold text-3xl mb-10 text-center">
            MEMBERS REGISTRATION
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
              {error}
            </div>
          )}

          <form onSubmit={handleRegistrationSubmit} className="w-full">
            <div className="md:flex w-full gap-8">
              <div className="w-full">
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Company Name *"
                    name="companyName"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Contact Person *"
                    name="contactperson"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="City"
                    name="contactcity"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="PSIRA Number"
                    name="sira_sob_number"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    type="tel"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Username *"
                    name="username"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Confirm Password *"
                    name="cpass"
                    type="password"
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Company Registration Number"
                    name="companyRegNo"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="P.O Box"
                    name="pobox"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Postal Code"
                    name="zipcode"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Email *"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Cell Number"
                    name="cellNumber"
                    type="tel"
                  />
                </div>
                <div className="w-full">
                  <input
                    className="bg-white p-3 my-2 w-[100%] border rounded"
                    placeholder="Password *"
                    name="apass"
                    type="password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center w-[40%] md:w-full mt-6">
              <div className="flex flex-col">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#167BA9] hover:bg-[#145a7d]"
                  } rounded-xl text-white font-normal p-3 px-3 my-2 transition-colors`}>
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegistrationDetails;
