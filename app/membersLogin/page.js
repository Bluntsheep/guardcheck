"use client";
import React, { useEffect, useState } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";
import RegSuccess from "../components/registrationsuccess/regsuccess";

const MembersLogin = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotUsername, setShowForgotUsername] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const form = e.target;
    const formData = new FormData(form);
    const dataToSend = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Login successful:", data);
        sessionStorage.setItem("userName", data.user.username);
        sessionStorage.setItem("userActive", data.user.active);
        sessionStorage.setItem("userId", data.user.id);
        sessionStorage.setItem("userRole", data.user.role);
        window.dispatchEvent(new Event("authStateChanged"));
        RegSuccess(data);

        router.push("/payment");
      } else {
        console.log("Login failed:", data.message);
        setError(data.message || "Invalid username or password");

        const passwordField = form.querySelector('input[name="password"]');
        if (passwordField) {
          passwordField.value = "";
        }
      }
    } catch (err) {
      console.log("Network error:", err);
      setError("Network error. Please try again.");

      const passwordField = form.querySelector('input[name="password"]');
      if (passwordField) {
        passwordField.value = "";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");

    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");

    if (!email) {
      setForgotError("Please enter your email address");
      return;
    }

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotMessage(
          "Password reset instructions have been sent to your email"
        );
        form.reset();
      } else {
        setForgotError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setForgotError("Network error. Please try again.");
    }
  };

  const handleForgotUsername = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");

    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");

    if (!email) {
      setForgotError("Please enter your email address");
      return;
    }

    try {
      const response = await fetch("/api/forgot-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotMessage("Your username has been sent to your email address");
        form.reset();
      } else {
        setForgotError(data.message || "Failed to send username");
      }
    } catch (err) {
      setForgotError("Network error. Please try again.");
    }
  };

  const resetForgotForms = () => {
    setShowForgotPassword(false);
    setShowForgotUsername(false);
    setForgotMessage("");
    setForgotError("");
  };

  useEffect(() => {
    const currentStatus = sessionStorage.getItem("currentUser");

    if (!currentStatus) {
      null;
    } else {
      router.push("/payment");
    }
  }, []);

  // Forgot Password Modal/Form
  if (showForgotPassword) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center py-18 mt-6 bg-[#FAFAFA]">
          <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[40%]">
            <form onSubmit={handleForgotPassword} className="w-full">
              <p className="font-bold text-3xl mb-10">RESET PASSWORD</p>

              {/* Success/Error messages */}
              {forgotMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{forgotMessage}</p>
                </div>
              )}

              {forgotError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{forgotError}</p>
                </div>
              )}

              <div className="w-full">
                <input
                  className="bg-white p-3 my-2 w-[100%]"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between w-full mt-4">
                <button
                  type="submit"
                  className="bg-[#167BA9] rounded-2xl text-white p-2 my-2">
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={resetForgotForms}
                  className="bg-gray-500 rounded-2xl text-white p-2 my-2 ml-0 md:ml-4">
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Forgot Username Modal/Form
  if (showForgotUsername) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center py-18 mt-6 bg-[#FAFAFA]">
          <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[40%]">
            <form onSubmit={handleForgotUsername} className="w-full">
              <p className="font-bold text-3xl mb-10">RECOVER USERNAME</p>

              {/* Success/Error messages */}
              {forgotMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{forgotMessage}</p>
                </div>
              )}

              {forgotError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">{forgotError}</p>
                </div>
              )}

              <div className="w-full">
                <input
                  className="bg-white p-3 my-2 w-[100%]"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between w-full mt-4">
                <button
                  type="submit"
                  className="bg-[#167BA9] rounded-2xl text-white p-2 my-2">
                  Send Username
                </button>
                <button
                  type="button"
                  onClick={resetForgotForms}
                  className="bg-gray-500 rounded-2xl text-white p-2 my-2 ml-0 md:ml-4">
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Main Login Form
  return (
    <div>
      <div className="flex flex-col items-center justify-center py-18 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[40%]">
          <form onSubmit={(e) => handleLogin(e)} className=" w-full">
            <p className=" font-bold text-3xl mb-10">LOGIN HERE</p>

            {/* Error message display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className=" w-full">
              <input
                className=" bg-white p-3 my-2 w-[100%]"
                name="username"
                placeholder="Username"
                required
              />
            </div>
            <div className=" w-full">
              <input
                name="password"
                type="password"
                className=" bg-white p-3 my-2 w-[100%]"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className=" flex flex-col md:flex-row justify-between w-full mt-4">
              <div className=" flex flex-col ">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#167BA9] rounded-2xl text-white p-2 my-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isLoading ? "Logging in..." : "Login Now"}
                </button>
                <div className="mt-3">
                  <label>
                    <input type="checkbox" />
                    <span className="ml-3 ">Remember Me</span>
                  </label>
                </div>
              </div>
              <div className=" flex-grow" />
              <div className=" text-[#14A2B8]">
                <div className=" ">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[#14A2B8] hover:underline cursor-pointer">
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotUsername(true)}
                    className="text-[#14A2B8] hover:underline cursor-pointer">
                    Forgot Username?
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MembersLogin;
