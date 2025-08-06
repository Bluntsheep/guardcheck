"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer/footer";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    siraSobNumber: "",
    phoneNumber: "",
    username: "",
    companyRegNumber: "",
    poBox: "",
    postalCode: "",
    cellNumber: "",
  });

  // Get user from sessionStorage safely
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const currentUser = sessionStorage.getItem("currentUser");
      // const currentUser = "994";

      if (!currentUser) {
        setMessage({
          type: "error",
          text: "No user session found. Please log in again.",
        });
        setIsLoading(false);
        return;
      }

      const sessionData = JSON.parse(currentUser);

      const userId = sessionData?.user?.id;

      if (sessionData.success && userId) {
        setUser(sessionData.user);
        loadUserProfile(userId);
      } else {
        setMessage({
          type: "error",
          text: "Invalid session structure. Please log in again.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setMessage({
        type: "error",
        text: "Invalid session data. Please log in again.",
      });
      setIsLoading(false);
    }
  }, []);

  // Load user profile data
  const loadUserProfile = async (userId) => {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Populate form with user data
        setFormData({
          companyName: data.user.company_name || "",
          contactPerson: data.user.contact_person || "",
          siraSobNumber: data.user.sira_sob_no || "",
          phoneNumber: data.user.phone_no || "",
          username: data.user.d_user || "",
          companyRegNumber: data.user.company_reg_no || "",
          poBox: data.user.pobox || "",
          postalCode: data.user.zipcode || "",
          cellNumber: data.user.cell_no || "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to load profile data",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setMessage({
        type: "error",
        text: "Error loading profile data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`/api/profile?userId=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.user,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.message || "Unknown error occurred",
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

    if (!user) {
      setMessage({
        type: "error",
        text: "No user session found",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading profile data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-10 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[50%]">
          <p className="font-bold text-3xl mb-10 text-center">UPDATE PROFILE</p>

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
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Company Name"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Contact Person"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="siraSobNumber"
                    value={formData.siraSobNumber}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="PSIRA / SOB Number"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="UserName"
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="w-full">
                  <input
                    name="companyRegNumber"
                    value={formData.companyRegNumber}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Company Registration Number"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="poBox"
                    value={formData.poBox}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="P.O Box"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Postal Code"
                  />
                </div>
                <div className="w-full">
                  <input
                    name="cellNumber"
                    value={formData.cellNumber}
                    onChange={handleInputChange}
                    className="bg-white p-3 my-2 w-[100%]"
                    placeholder="Cell Number"
                  />
                </div>
              </div>
            </div>

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
                  {isSubmitting ? "UPDATING..." : "UPDATE PROFILE"}
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

export default UpdateProfile;
