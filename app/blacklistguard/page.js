"use client";
import React, { useEffect, useState } from "react";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";

const BlackListGuard = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    gender: "",
    idnumber: "",
    sira_sob_no: "",
    date: "",
    reason: "",
    description: "",
    acceptance_letter: false,
    other: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [currentId, setCurrentId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = sessionStorage.getItem("userId");
      setCurrentId(userId);
      console.log("Current User ID:", userId);
    }
  }, []);

  console.log(currentId);

  const handleBack = () => {
    router.push("/payment");
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" || type === "radio" ? checked : value,
    }));
  };

  // POST request function
  const addGuardToBlacklist = async (guardData) => {
    try {
      const response = await fetch("/api/findguards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guardData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.error || "Unknown error occurred",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error: " + error.message,
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.surname || !formData.idnumber) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields (Name, Surname, ID Number)",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      gender: formData.gender || null,
      idnumber: formData.idnumber.trim(),
      sira_sob_no: formData.sira_sob_no.trim() || null,
      date: formData.date || new Date().toISOString().split("T")[0],
      reason: formData.reason === "Select Reason" ? null : formData.reason,
      description: formData.description.trim() || null,
      acceptance_letter: formData.acceptance_letter ? "Yes" : "No",
      file: null, // You can add file upload functionality later
      reg_user_id: Number(currentId), // You might want to get this from user session
      read_l_report: null, // You can add this field if needed
      other: formData.other.trim() || null,
    };

    try {
      const result = await addGuardToBlacklist(submitData);

      if (result.success) {
        setMessage({
          type: "success",
          text: `Guard ${result.data.name} ${result.data.surname} has been successfully added to the blacklist.`,
        });

        // Reset form
        setFormData({
          name: "",
          surname: "",
          gender: "",
          idnumber: "",
          sira_sob_no: "",
          date: "",
          reason: "",
          description: "",
          acceptance_letter: false,
          other: "",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-10 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[50%]">
          <p className="font-bold text-3xl mb-10 text-center">
            ADD BLACKLISTED GUARD
          </p>

          {/* Success/Error Message */}
          {message.text && (
            <div
              className={`w-full p-3 mb-4 rounded ${
                message.type === "success"
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="md:flex w-full gap-8">
              <div className="w-full">
                <div className="w-full">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Name *"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Gender: Male / Female"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="sira_sob_no"
                    value={formData.sira_sob_no}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="PSIRA / SOB Number"
                  />
                </div>
                <div className="w-full">
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]">
                    <option value="">Select Reason</option>
                    <option value="Dismissed">Dismissed</option>
                    <option value="Absconded">Absconded</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="w-full">
                <div className="w-full">
                  <input
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Surname *"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    name="idnumber"
                    value={formData.idnumber}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="ID Number *"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    type="date"
                    className="bg-white p-3 my-2 w-[100%]"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full gap-8 my-2 p-3">
              <div className="w-1/2">
                <p className="text-wrap">
                  Has the Guard signed an acceptance letter
                </p>
                <div className="flex">
                  <input
                    name="acceptance_letter"
                    type="radio"
                    checked={formData.acceptance_letter}
                    onChange={handleInputChange}
                  />
                  <p className="ml-3">Yes</p>
                </div>
              </div>
            </div>

            <textarea
              name="other"
              value={formData.other}
              onChange={handleInputChange}
              placeholder="Other notes or comments"
              className="w-full bg-white p-3"
              rows="4"
            />

            <div className="flex flex-col md:flex-row justify-center w-[40%] md:w-full mt-6">
              <div className="flex flex-col">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-xl text-white font-normal p-3 px-3 my-2 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#167BA9] hover:bg-[#145a7d]"
                  }`}>
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT NOW"}
                </button>
              </div>
            </div>
          </form>
        </div>
        <button
          onClick={handleBack}
          className="bg-[#14A2B8] rounded-md text-white font-normal p-3 px-6 hover:bg-[#0f8a9e] transition-colors">
          Back
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default BlackListGuard;
