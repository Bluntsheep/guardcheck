"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

const CvUpdatemobile = () => {
  const router = useRouter();
  const [status, setStatus] = useState(null);
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
          headers: { "Content-Type": "application/json" },
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

  const inputClass = "w-full bg-slate-200 p-3 text-base rounded";
  const selectClass = "w-full bg-slate-200 p-3 rounded";

  return (
    <div className="flex md:hidden bg-[#FAFAFA] w-full">
      <div className="w-full">
        {/* Header */}
        <div className="flex bg-[#167BA9] justify-around p-5 mb-5">
          <div className="bg-white p-6 rounded-full flex items-center justify-center">
            <FaRegCopy color="grey" size={50} />
          </div>
          <div className="flex flex-col justify-center text-center text-white font-bold text-2xl">
            <p>SUBMIT</p>
            <p>SECURITY</p>
            <p>GUARD CV</p>
          </div>
        </div>

        <form onSubmit={handleCVSubmit}>
          <div className="flex flex-col gap-3 px-6 pb-10">
            {/* Success banner */}
            {status === "success" && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-300 text-green-800 rounded-md px-4 py-3 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5"
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
              <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-800 rounded-md px-4 py-3 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5"
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

            {/* Every field is full-width and stacked — gives dropdowns room to open downward */}
            <input name="name" className={inputClass} placeholder="Name" />
            <input
              name="surname"
              className={inputClass}
              placeholder="Surname"
            />
            <input
              name="idnum"
              className={inputClass}
              placeholder="ID Number"
            />
            <input
              name="snum"
              className={inputClass}
              placeholder="PSIRA Number"
            />
            <input name="phonenum" className={inputClass} placeholder="Phone" />

            <select
              name="g_area"
              id="g_area"
              className={selectClass}
              style={{ fontSize: "16px" }}>
              <option value="">Select Region</option>
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

            <input name="town" className={inputClass} placeholder="Town" />

            <select
              name="g_hgrade"
              className={selectClass}
              style={{ fontSize: "16px" }}>
              <option value="">Select Highest Grade</option>
              <option value="Grade A">A</option>
              <option value="Grade B">B</option>
              <option value="Grade C">C</option>
              <option value="Grade D">D</option>
            </select>

            {/* Gender */}
            <div className="flex gap-8 justify-center py-1">
              <label className="flex items-center gap-2 text-sm">
                <input value="male" name="gender" type="radio" />
                Male
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input value="female" name="gender" type="radio" />
                Female
              </label>
            </div>

            <textarea
              name="pexp"
              className="w-full bg-slate-200 p-3 text-base rounded"
              rows={5}
              placeholder="Personal Experience"
            />

            {/* Guard type */}
            <div>
              <p className="text-xs mb-2">Guard Type:</p>
              <div className="flex justify-around text-sm">
                <label className="flex items-center gap-2">
                  <input
                    value="Security guard"
                    type="checkbox"
                    name="guard_type"
                  />
                  Security guard
                </label>
                <label className="flex items-center gap-2">
                  <input
                    value="Armed response"
                    type="checkbox"
                    name="guard_type"
                  />
                  Armed response
                </label>
                <label className="flex items-center gap-2">
                  <input
                    value="Control room"
                    type="checkbox"
                    name="guard_type"
                  />
                  Control room
                </label>
              </div>
            </div>

            <input name="date" className="hidden" defaultValue="" />

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-[#167BA9] text-white px-8 py-3 rounded-md w-[50%] hover:bg-[#0F5A7B] transition-colors duration-300">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CvUpdatemobile;
