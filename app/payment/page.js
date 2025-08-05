"use client";
import React, { useEffect, useState } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";

const Payments = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const checkUserStatus = () => {
      try {
        const user = sessionStorage.getItem("currentUser");

        if (user) {
          const userData = JSON.parse(user);
          const active = userData.user?.active || userData.active;

          setUserStatus(active);

          if (active === 1) {
            router.push("/dashboard");
            return;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user status:", error);
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div>
        <div className="text-center my-28">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-56 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      <div className="text-center my-28">
        <p className="text-5xl font-bold">Payment:</p>
        <p className="text-slate-500 mt-6 text-lg">EFT Payment</p>
        <p className="text-slate-500 mt-4 text-lg">
          Subscription is a yearly fee of R 2850.00
        </p>
        <p className="text-slate-500 text-lg">
          After subscription, you will be able to login.
        </p>
        <p className="text-[#137AA7] mt-6 text-lg">Guardcheck.com</p>
        <p className="text-[#137AA7] text-lg">Nedbank</p>
        <p className="text-[#137AA7] text-lg">Acc No 1311842535</p>
        <p className="text-slate-500 mt-6 text-lg">
          Please email proof of payment to info@guardcheck.com with your company
          name as a reference
        </p>
        <p className="text-slate-500 text-lg">
          We will activate your account within 2 business days.
        </p>

        {userStatus === 0 && (
          <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg max-w-md mx-auto">
            <p className="text-yellow-800 font-medium">
              Your account is currently inactive. Please complete the payment
              process above to activate your account.
            </p>
          </div>
        )}
      </div>

      <div className="my-5 items-center align-middle text-center"></div>

      <Footer />
    </div>
  );
};

export default Payments;
