"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaBars, FaHamburger } from "react-icons/fa";

const Menubar = () => {
  const [selectedTab, setSelectedTab] = useState();
  const router = useRouter();
  const [menuActive, setMenuActive] = useState(false);

  const handleMenu = () => {
    setMenuActive(!menuActive);
    console.log(menuActive);
  };

  const tabChange = (e, tab) => {
    e.preventDefault();
    setSelectedTab(tab);
    router.push(`/${tab}`);
  };

  return (
    <div>
      <div className="bg-[#137AA7] px-[10%] text-white justify-between items-center shadow-2xl hidden md:flex">
        <div>
          <p>Contact Us: 012-492-9089 | info@guardcheck.com</p>
        </div>
        <div className="bg-[#FF1001] text-white py-4 px-8 h-[100%]">
          <p>Yearly Fee of R 2850.00 no hidden costs</p>
        </div>
      </div>

      <div className="sm:absolute shadow-lg border border-gray-300 ">
        <div className="md:hidden flex justify-between items-center bg-[#137AA7] px-4 py-2 text-white shadow-2xl">
          <Image
            src="/guard_check_logo.jpeg" // Path to your image in the public folder
            alt="Description of image"
            width={80} // Desired width in pixels
            height={80} // Desired height in pixels
          />
          <div>
            <button onClick={handleMenu} className="text-white text-2xl">
              <FaBars />
            </button>
          </div>
        </div>
        <div className={`${!menuActive ? "hidden" : ""}`}>
          <Link href={"/"}>
            <div className=" bg-white">
              <p className=" text-2xl p-2 pl-2 font-medium text-slate-900 border-b-1">
                Home
              </p>
            </div>
          </Link>
          <Link href={"/faq"}>
            <div className=" bg-white">
              <p className=" text-2xl p-2 pl-2 font-medium text-slate-900 border-b-1">
                FAQ
              </p>
            </div>
          </Link>
          <Link href={"/membersLogin"}>
            <div className=" bg-white">
              <p className=" text-2xl p-2 pl-2 font-medium text-slate-900 border-b-1">
                Member Login
              </p>
            </div>
          </Link>
          <Link href={"/register"}>
            <div className=" bg-white">
              <p className=" text-2xl p-2 pl-2 font-medium text-slate-900 border-b-1">
                Register
              </p>
            </div>
          </Link>
          <Link href={"/contact"}>
            <div className=" bg-white">
              <p className=" text-2xl p-2 pl-2 font-medium text-slate-900 border-b-1">
                Contact
              </p>
            </div>
          </Link>
          <Link href={"/terms"}>
            <div className=" bg-white">
              <p className=" text-2xl p-2 pl-2 font-medium text-slate-900 border-b-1">
                Terms & Conditions
              </p>
            </div>
          </Link>
          <Link href={"/POPI"}>
            <div className=" bg-white">
              <p className=" text-2xl p-2 pl-2 font-medium text-slate-900 border-b-1">
                POPI
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="hidden md:flex px-[12%] py-2 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <Image
          src="/guard_check_logo.jpeg" // Path to your image in the public folder
          alt="Description of image"
          width={150} // Desired width in pixels
          height={150} // Desired height in pixels
        />
        <div className=" flex gap-10 items-end w-full text-[#3E4161] cursor-pointer ">
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
