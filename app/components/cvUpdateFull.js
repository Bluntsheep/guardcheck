"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

const CvUpdateFull = () => {
  const router = useRouter();
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const handleCVSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrorMessage("");

    const form = e.target;
    const formData = new FormData(form);
    const selectedGuardTypesArray = formData.getAll("guard_type");
    let finalGuardTypeString = selectedGuardTypesArray;

    const currentdate = formData.get("date");

    if (currentdate.length > 0) {
      console.log("Cv Uploaded...");
      return;
    } else {
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      if (selectedGuardTypesArray.length > 0) {
        const multiple = (finalGuardTypeString =
          selectedGuardTypesArray.join(", "));
        formObject.guard_type = multiple;
      } else {
        formObject.guard_type = finalGuardTypeString;
      }

      try {
        const response = await fetch("/api/cvUpload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          form.reset();
        } else {
          setStatus("error");
          setErrorMessage(
            data?.message || "CV upload failed. Please try again.",
          );
        }
      } catch (error) {
        console.error("Frontend CV Upload error:", error);
        setStatus("error");
        setErrorMessage(
          "Something went wrong. Please check your connection and try again.",
        );
      }
    }
  };

  return (
    <div className="flex-col items-center justify-center py-3 md:py-12 mt-16 bg-[#FAFAFA] hidden md:flex">
      <form onSubmit={handleCVSubmit}>
        <div className="flex">
          <div className="flex flex-col items-center justify-center p-3 md:p-32 bg-[#167BA9]">
            <div className="bg-white p-8 rounded-full">
              <FaRegCopy color="grey" size={100} />
            </div>
            <div className="flex flex-col text-center text-white font-bold text-2xl mt-12">
              <p>SUBMIT</p>
              <p>SECURITY</p>
              <p>GUARD CV</p>
            </div>
          </div>
          <div className="bg-white flex flex-col justify-between px-3">
            {/* Success banner */}
            {status === "success" && (
              <div className="mx-8 mt-4 flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 rounded-md px-4 py-3 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold">CV submitted successfully!</p>
                  <p className="text-green-700">
                    Your CV has been uploaded and sent to security companies.
                  </p>
                </div>
              </div>
            )}

            {/* Error banner */}
            {status === "error" && (
              <div className="mx-8 mt-4 flex items-center gap-3 bg-red-50 border border-red-300 text-red-800 rounded-md px-4 py-3 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold">Upload failed</p>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="flex gap-8 mx-8">
              <input
                name="name"
                className="bg-slate-200 p-3 text-lg"
                placeholder="Name"
              />
              <input
                name="surname"
                className="bg-slate-200 p-3 text-lg"
                placeholder="Surname"
              />
            </div>
            <div className="flex gap-8 mx-8">
              <input
                name="idnum"
                className="bg-slate-200 p-3 text-lg"
                placeholder="ID Number"
              />
              <input
                name="snum"
                className="bg-slate-200 p-3 text-lg"
                placeholder="PSIRA Number"
              />
            </div>
            <div className="flex gap-8 mx-8">
              <input
                name="phonenum"
                className="bg-slate-200 p-3 text-lg"
                placeholder="Phone"
              />
              <select
                className="bg-slate-200 p-3 text-lg w-full"
                id="g_area"
                name="g_area">
                <option value="Select Region">Select Region</option>
                <option value="EC">Eastern Cape</option>
                <option value="FS">Free State</option>
                <option value="GP">Gauteng</option>
                <option value="KZN">Kwazulu-Natal</option>
                <option value="PM">Mpumalanga</option>
                <option value="NC">Northen Cape</option>
                <option value="LP">Limpopo</option>
                <option value="NWP">North West Province</option>
                <option value="WC">Western Cape</option>
              </select>
            </div>
            <div className="flex gap-8 mx-8">
              <input
                name="town"
                className="bg-slate-200 p-3 text-lg"
                placeholder="Town"
              />
              <select
                name="g_hgrade"
                className="bg-slate-200 p-3 text-lg w-full">
                <option value="Select Highest Grade">
                  Select Highest Grade
                </option>
                <option value="Grade A">A</option>
                <option value="Grade B">B</option>
                <option value="Grade C">C</option>
                <option value="Grade D">D</option>
              </select>
            </div>
            <div className="flex gap-8 justify-center text-xs">
              <div>
                <label>
                  <input value="male" name="gender" type="radio" />
                  <span className="ml-2">Male</span>
                </label>
              </div>
              <div>
                <label>
                  <input value="female" name="gender" type="radio" />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>
            <div className="flex gap-8 justify-center">
              <textarea
                name="pexp"
                className="w-[90%] bg-slate-200 p-3"
                rows={5}
                placeholder="Personal Experience"
              />
            </div>
            <div className="text-xs pl-3">
              <p>Guard Type:</p>
            </div>
            <div className="text-xs px-5 flex gap-2 justify-around">
              <label className="ml-2">
                <input
                  value="Security guard"
                  type="checkbox"
                  name="guard_type"
                />
                <span className="ml-2">Security guard</span>
              </label>
              <label className="ml-2">
                <input
                  value="Armed response"
                  type="checkbox"
                  name="guard_type"
                />
                <span className="ml-2">Armed response</span>
              </label>
              <label className="ml-2">
                <input value="Control room" type="checkbox" name="guard_type" />
                <span className="ml-2">Control room</span>
              </label>
            </div>
            <input name="date" className="hidden" defaultValue="" />
            <button
              type="submit"
              className="bg-[#167BA9] text-white p-3 mt-4 rounded-md w-[30%] self-center hover:bg-[#0F5A7B] transition-colors duration-300">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CvUpdateFull;
