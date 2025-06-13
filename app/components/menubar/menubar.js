"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Menubar = () => {
  const [selectedTab, setSelectedTab] = useState();
  const router = useRouter();

  const tabChange = (e, tab) => {
    e.preventDefault();
    setSelectedTab(tab);
    router.push(`/${tab}`);
  };

  return (
    <div>
      <div className="bg-[#137AA7] px-[10%] text-white flex justify-between items-center">
        <div>
          <p>Contact Us: 012-492-9089 | info@guardcheck.com</p>
        </div>
        <div className="bg-[#FF1001] text-white py-4 px-8 h-[100%]">
          <p>Yearly Fee of R 2850.00 no hidden costs</p>
        </div>
      </div>
      <div className=" px-[12%] py-2 flex bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <Image
          src="/guard_check_logo.jpeg" // Path to your image in the public folder
          alt="Description of image"
          width={150} // Desired width in pixels
          height={150} // Desired height in pixels
        />
        <div className="flex gap-10 items-end w-full text-[#3E4161] cursor-pointer">
          <div className=" flex-grow " />
          <Link href={"/"}>
            <p
              onClick={(e) => tabChange(e, "")}
              className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
                selectedTab === "Home"
                  ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                  : ""
              }`}>
              Home
            </p>
          </Link>

          <p
            onClick={(e) => tabChange(e, "faq")}
            className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
              selectedTab === "FAQ"
                ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                : ""
            }`}>
            FAQ
          </p>
          <Link href={"/membersLogin"}>
            <p
              onClick={(e) => tabChange(e, "membersLogin")}
              className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
                selectedTab === "Login"
                  ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                  : ""
              }`}>
              Member Login
            </p>
          </Link>
          <Link href={"register"}>
            <p
              onClick={(e) => tabChange(e, "register")}
              className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
                selectedTab === "Register"
                  ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                  : ""
              }`}>
              Register
            </p>
          </Link>
          <Link href={"/contact"}>
            <p
              onClick={(e) => tabChange(e, "contact")}
              className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
                selectedTab === "Contact"
                  ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                  : ""
              }`}>
              Contact
            </p>
          </Link>
          <Link href={"/terms"}>
            <p
              onClick={(e) => tabChange(e, "terms")}
              className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
                selectedTab === "Terms"
                  ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                  : ""
              }`}>
              Terms & Conditions
            </p>
          </Link>
          <p
            onClick={(e) => tabChange(e, "POPI")}
            className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
              selectedTab === "POPI"
                ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                : ""
            }`}>
            POPI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
