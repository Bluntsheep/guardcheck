import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { FaEnvelope, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";

const Contact = () => {
  return (
    <div>
      <Menubar />
      <div className="flex flex-col items-center justify-center py-18 bg-[#FAFAFA]">
        <div className="flex flex-col items-center bg-[#F9F9F9] border-4 border-[#167BA9] p-10 my-5 w-[50%]">
          <p className=" font-bold text-3xl mb-10">CONTACT US</p>
          <div className=" text-black flex gap-4 w-full">
            <input className=" bg-white p-3 my-2 w-full " placeholder="Name" />
            <input className=" bg-white p-3 my-2 w-full " placeholder="Email" />
          </div>
          <div className=" w-full">
            <input
              className=" bg-white p-3 my-2 w-[100%]"
              placeholder="Subject"
            />
          </div>
          <div className=" w-full">
            <input
              className=" bg-white p-3 my-2 w-[100%]"
              placeholder="Message"
            />
          </div>
          <button className="bg-[#167BA9] rounded-2xl text-white p-2 my-2 w-[20%]">
            Submit Now
          </button>
        </div>
      </div>

      <div className="flex flex-col p-32  bg-white w-full">
        <p className=" font-bold text-3xl mb-4">COMPANY INFORMATION</p>
        <div className=" flex justify-around w-full gap-10">
          <div className=" flex gap-6 bg-white p-6 shadow-lg mt-8 justify-center items-center w-full hover:shadow-xs">
            <div>
              <FaLocationDot color="#167BA9" size={50} />
            </div>
            <div>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Postnet Suite 103,
              </p>
              <p className=" text-[#888888] mt-2">
                Private bag X0003, Ifafi, 0260
              </p>
            </div>
          </div>
          <div className=" flex gap-6 bg-white p-8 shadow-md mt-8   w-full hover:shadow-xs">
            <div>
              <FaPhoneVolume color="#167BA9" size={50} />
            </div>
            <div>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Call Us
              </p>
              <p className=" text-[#888888] mt-2">012-492-9089</p>
            </div>
          </div>
          <div className=" flex gap-6 bg-white p-8 shadow-md mt-8   w-full hover:shadow-xs">
            <div>
              <FaEnvelope color="#167BA9" size={50} />
            </div>
            <div>
              <p className=" font-bold text-xl hover:text-red-600 text-[#12114A]">
                Mail Us
              </p>
              <p className=" text-[#888888] mt-2">info@guardcheck.com</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
