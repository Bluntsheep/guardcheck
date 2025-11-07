"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { FaBars } from "react-icons/fa";

const Menubar = () => {
  const [selectedTab, setSelectedTab] = useState();
  const router = useRouter();
  const [menuActive, setMenuActive] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [userStatus, setUserStatus] = useState(null);
  const [loginItems, setLoginItems] = useState("/login");
  const [isLoading, setIsLoading] = useState(true);
  const [authKey, setAuthKey] = useState(0); // Force re-render key

  const handleMenu = () => {
    setMenuActive(!menuActive);
  };

  const updateAuthState = useCallback(() => {
    try {
      const user = sessionStorage.getItem("userName");
      const activeStatus = sessionStorage.getItem("userActive");

      console.log("Retrieved from sessionStorage:", user, activeStatus);

      if (user) {
        setCurrentUser(user);
        setUserStatus(activeStatus);
        setLoginItems(activeStatus === "1" ? "/dashboard" : "/payment");
      } else {
        setCurrentUser("");
        setUserStatus(null);
        setLoginItems("/login");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setCurrentUser("");
      setUserStatus(null);
      setLoginItems("/login");
    }
    setIsLoading(false);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();

    // Clear all session data
    sessionStorage.clear();

    // Force immediate state update
    setCurrentUser("");
    setUserStatus(null);
    setLoginItems("/login");
    handleMenu();
    setAuthKey((prev) => prev + 1); // Force re-render

    // Optional: Show a logout message
    console.log("User logged out successfully");

    // Navigate to home page
    router.push("/");
  };

  const tabChange = (e, tab) => {
    e.preventDefault();
    setSelectedTab(tab);
    router.push(`/${tab}`);
  };

  // Check auth state on every route change
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState, router]);

  // Initial auth check
  useEffect(() => {
    updateAuthState();
  }, [updateAuthState]);

  // Global auth change listener - much more efficient than polling
  useEffect(() => {
    const handleAuthChange = () => {
      updateAuthState();
      setAuthKey((prev) => prev + 1);
    };

    // Listen for custom auth events (most important)
    window.addEventListener("authStateChanged", handleAuthChange);

    // Listen for focus events (when user returns to tab)
    window.addEventListener("focus", handleAuthChange);

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleAuthChange();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateAuthState]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div>
      <div className="bg-[#137AA7] px-[10%] text-white justify-between items-center shadow-2xl hidden md:flex">
        <div>
          <p>Contact Us: 082-551-7908 | info@guardcheck.com</p>
        </div>
        <div className="bg-[#FF1001] text-white py-4 px-8 h-[100%]">
          <p>Yearly Fee of R 2850.00 no hidden costs</p>
        </div>
      </div>

      <div className="hidden md:flex px-[12%] py-2 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <Image
          src="/guard_check_logo.jpeg"
          alt="Guard Check Logo"
          width={150}
          height={150}
        />
        <div className="flex gap-10 items-end w-full text-[#3E4161]">
          <div className="flex-grow" />
          <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div key={authKey}>
      {/* Top info bar */}
      <div className="bg-[#137AA7] px-[10%] text-white justify-between items-center shadow-2xl hidden md:flex">
        <div>
          <p>Contact Us: 082-551-7908 | info@guardcheck.com</p>
        </div>
        <div className="bg-[#FF1001] text-white py-4 px-8 h-[100%]">
          <p>Yearly Fee of R 2850.00 no hidden costs</p>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:absolute shadow-lg border border-gray-300">
        <div className="md:hidden flex justify-between items-center bg-[#137AA7] px-4 py-2 text-white shadow-2xl">
          <Image
            src="/guard_check_logo.jpeg"
            alt="Guard Check Logo"
            width={80}
            height={80}
          />
          <button onClick={handleMenu} className="text-white text-2xl">
            <FaBars />
          </button>
        </div>

        {/* Mobile menu items */}
        <div className={`${!menuActive ? "hidden" : ""} md:hidden`}>
          <Link href="/">
            <div
              onClick={handleMenu}
              className="bg-white border-b-[1px] border-slate-300">
              <p className="text-xl p-2 pl-4 font-medium text-slate-600">
                Home
              </p>
            </div>
          </Link>

          <Link href="/faq">
            <div
              onClick={handleMenu}
              className="bg-white border-b-[1px] border-slate-300">
              <p className="text-xl p-2 pl-4 font-medium text-slate-600">FAQ</p>
            </div>
          </Link>

          <Link href={currentUser ? loginItems : "/membersLogin"}>
            <div
              onClick={handleMenu}
              className="bg-white border-b-[1px] border-slate-300">
              <p className="text-xl p-2 pl-4 font-medium text-slate-600">
                {currentUser ? `${currentUser} ` : "Member Login"}
              </p>
            </div>
          </Link>

          {!currentUser && (
            <Link href="/register">
              <div
                onClick={handleMenu}
                className="bg-white border-b-[1px] border-slate-300">
                <p className="text-xl p-2 pl-4 font-medium text-slate-600">
                  Register
                </p>
              </div>
            </Link>
          )}
          {currentUser && (
            <div
              onClick={handleLogout}
              className="bg-white border-b-[1px] border-slate-300 cursor-pointer">
              <p className="text-xl p-2 pl-4 font-medium text-slate-600">
                Logout
              </p>
            </div>
          )}

          <Link href="/contact">
            <div
              onClick={handleMenu}
              className="bg-white border-b-[1px] border-slate-300">
              <p className="text-xl p-2 pl-4 font-medium text-slate-600">
                Contact
              </p>
            </div>
          </Link>

          <Link href="/terms">
            <div
              onClick={handleMenu}
              className="bg-white border-b-[1px] border-slate-300">
              <p className="text-xl p-2 pl-4 font-medium text-slate-600">
                Terms & Conditions
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex px-[12%] py-2 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <Image
          src="/guard_check_logo.jpeg"
          alt="Guard Check Logo"
          width={150}
          height={150}
        />

        <div className="flex gap-10 items-end w-full text-[#3E4161] cursor-pointer">
          <div className="flex-grow" />

          <Link href="/">
            <p
              onClick={(e) => tabChange(e, "")}
              className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
              Home
            </p>
          </Link>

          <p
            onClick={(e) => tabChange(e, "faq")}
            className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
            FAQ
          </p>

          {currentUser ? (
            <Link href={loginItems}>
              <p className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
                {currentUser}
              </p>
            </Link>
          ) : (
            <Link href="/membersLogin">
              <p className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
                Login
              </p>
            </Link>
          )}

          {!currentUser && (
            <Link href="/register">
              <p className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
                Register
              </p>
            </Link>
          )}
          {currentUser && (
            <p
              onClick={handleLogout}
              className="hover:underline underline-offset-8 decoration-2 decoration-purple-900 cursor-pointer">
              Logout
            </p>
          )}

          <Link href="/contact">
            <p className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
              Contact
            </p>
          </Link>

          <Link href="/terms">
            <p className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
              Terms & Conditions
            </p>
          </Link>

          <p
            onClick={(e) => tabChange(e, "popi")}
            className="hover:underline underline-offset-8 decoration-2 decoration-purple-900">
            POPI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
