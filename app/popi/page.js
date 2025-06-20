import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { FaRegArrowAltCircleDown } from "react-icons/fa";

const PopiManual = () => {
  return (
    <div>
      <Menubar />
      <div className="w-full flex justify-around p-10 pt-10">
        <div className="flex gap-6 bg-white p-8 self-center shadow-md mt-8 hover:shadow-xs md:w-[40%] justify-center">
          <div>
            <FaRegArrowAltCircleDown color="#167BA9" size={50} />
          </div>
          <div>
            <a href="/popi.pdf " download>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Popi Manual
              </p>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PopiManual;
