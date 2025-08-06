"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer/footer";

const ChangePassword = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user ID from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const currentUser = sessionStorage.getItem("currentUser");
      if (!currentUser) {
        setMessage({
          type: "error",
          text: "No user session found. Please log in.",
        });
        return;
      }

      const sessionData = JSON.parse(currentUser);
      const id = sessionData?.user?.id;

      if (id) {
        setUserId(id);
      } else {
        setMessage({
          type: "error",
          text: "Invalid user session. Please log in.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Invalid session data. Please log in.",
      });
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    if (!userId) {
      setMessage({
        type: "error",
        text: "No user session found. Please log in.",
      });
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Please fill in both password fields.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/profile/change-password?userId=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: formData.password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setFormData({ password: "", confirmPassword: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to change password.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-10 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[50%]">
          <p className="font-bold text-3xl mb-10 text-center">
            Change Password
          </p>

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
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-white p-3 my-2 w-full"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-white p-3 my-2 w-full"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-xl text-white font-normal p-3 px-3 my-2 w-full ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#167BA9] hover:bg-[#145a7d]"
              }`}>
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePassword;
