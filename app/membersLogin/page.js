"use client";
import React, { useEffect } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";
import RegSuccess from "../components/registrationsuccess/regsuccess";

const MembersLogin = () => {
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const dataToSend = Object.fromEntries(formData.entries());

    console.log(dataToSend);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        console.log("Login successful:", data.message);
        RegSuccess(data);

        router.push("/payment");
      } else {
        console.log("Login failed:", data.message);
      }
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  useEffect(() => {
    const currentStatus = sessionStorage.getItem("currentUser");

    console.log("userStatus", currentStatus);

    if (!currentStatus) {
      null;
    } else {
      router.push("/payment");
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-18 mt-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-3 md:p-10 my-5 w-[90%] md:w-[40%]">
          <form onSubmit={(e) => handleLogin(e)} className=" w-full">
            <p className=" font-bold text-3xl mb-10">LOGIN HERE</p>

            <div className=" w-full">
              <input
                className=" bg-white p-3 my-2 w-[100%]"
                name="username"
                placeholder="Username"
              />
            </div>
            <div className=" w-full">
              <input
                name="password"
                type="password"
                className=" bg-white p-3 my-2 w-[100%]"
                placeholder="Enter Password"
              />
            </div>
            <div className=" flex flex-col md:flex-row justify-between w-full mt-4">
              <div className=" flex flex-col ">
                <button className="bg-[#167BA9] rounded-2xl text-white p-2 my-2 ">
                  Login Now
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
                  <p>Forgot Password?</p>
                </div>
                <div className="mt-4">
                  <p>Forgot Username?</p>
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
