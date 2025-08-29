"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "../components/footer/footer";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid reset link");
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Password has been reset successfully!");
        setTimeout(() => {
          router.push("/membersLogin");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-18 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[40%]">
          <form onSubmit={handleResetPassword} className="w-full">
            <p className="font-bold text-3xl mb-10">RESET PASSWORD</p>

            {/* Success message */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{success}</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="w-full">
              <input
                className="bg-white p-3 my-2 w-[100%]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                minLength="6"
              />
            </div>

            <div className="w-full">
              <input
                className="bg-white p-3 my-2 w-[100%]"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
                minLength="6"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between w-full mt-4">
              <button
                type="submit"
                disabled={isLoading || !token}
                className="bg-[#167BA9] rounded-2xl text-white p-2 my-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
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
};

export default ResetPassword;
