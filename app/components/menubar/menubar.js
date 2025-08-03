"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBars, FaHamburger } from "react-icons/fa";

const Menubar = () => {
  const [selectedTab, setSelectedTab] = useState();
  const router = useRouter();
  const [menuActive, setMenuActive] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [userStatus, setUserStatus] = useState(null);
  const [loginItems, setLoginItems] = useState("login");

  const handleMenu = () => {
    setMenuActive(!menuActive);
    console.log(menuActive);
  };

  const tabChange = (e, tab) => {
    e.preventDefault();
    setSelectedTab(tab);
    router.push(`/${tab}`);
  };

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window !== "undefined") {
      try {
        const user = sessionStorage.getItem("currentUser");

        if (user) {
          const userData = JSON.parse(user);
          console.log("this is the current user:::", userData);

          // Set current user - assuming the structure is either userData.username or userData.user.username
          if (userData.user && userData.user.username) {
            setCurrentUser(userData.user.username);
            setUserStatus(userData.user.active);
          } else if (userData.username) {
            setCurrentUser(userData.username);
            setUserStatus(userData.active);
          }

          // Set login items based on user status
          if (userData.user?.active === 1 || userData.active === 1) {
            setLoginItems("/dashboard");
          } else {
            setLoginItems("/payments");
          }
        } else {
          setLoginItems("/login");
        }
      } catch (error) {
        console.error("Error parsing user data from sessionStorage:", error);
        setLoginItems("/login");
      }
    }
  }, []);

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
            <div className=" bg-white border-b-[1px] border-slate-300">
              <p className=" text-xl p-2 pl-4 font-medium text-slate-600 ">
                Home
              </p>
            </div>
          </Link>
          <Link href={"/faq"}>
            <div className=" bg-white border-b-[1px] border-slate-300">
              <p className=" text-xl p-2 pl-4 font-medium text-slate-600 ">
                FAQ
              </p>
            </div>
          </Link>
          <Link href={currentUser ? loginItems : "/membersLogin"}>
            <div className=" bg-white border-b-[1px] border-slate-300">
              <p className=" text-xl p-2 pl-4 font-medium text-slate-600 ">
                {!currentUser
                  ? "Member Login"
                  : `${currentUser} ${
                      userStatus === 1 ? "(Active)" : "(Inactive)"
                    }`}
              </p>
            </div>
          </Link>
          {!currentUser && (
            <Link href={"/register"}>
              <div className={`bg-white border-b-[1px] border-slate-300  `}>
                <p className=" text-xl p-2 pl-4 font-medium text-slate-600 ">
                  Register
                </p>
              </div>
            </Link>
          )}
          <Link href={"/contact"}>
            <div className=" bg-white border-b-[1px] border-slate-300">
              <p className=" text-xl p-2 pl-4 font-medium text-slate-600 ">
                Contact
              </p>
            </div>
          </Link>
          <Link href={"/terms"}>
            <div className=" bg-white border-b-[1px] border-slate-300">
              <p className=" text-xl p-2 pl-4 font-medium text-slate-600 ">
                Terms & Conditions
              </p>
            </div>
          </Link>
          <Link href={"/popi"}>
            <div className=" bg-white border-b-[1px] border-slate-300">
              <p className=" text-xl p-2 pl-4 font-medium text-slate-600 ">
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
          <Link href={currentUser ? loginItems : "/membersLogin"}>
            <p
              onClick={(e) => tabChange(e, "membersLogin")}
              className={` hover:underline underline-offset-8 decoration-2 decoration-purple-900 ${
                selectedTab === "Login"
                  ? "underline underline-offset-8 decoration-2 decoration-purple-900"
                  : ""
              }`}>
              {!currentUser
                ? "Member Login"
                : `${currentUser} ${
                    userStatus === 1 ? "(Active)" : "(Inactive)"
                  }`}
            </p>
          </Link>
          {!currentUser && (
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
          )}
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
            onClick={(e) => tabChange(e, "popi")}
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
