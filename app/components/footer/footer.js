import React from "react";

const Footer = () => {
  return (
    <div className=" bg-[#012533] px-32 py-16 flex gap-6 justify-around text-md ">
      <div className="text-white p-5 w-4/12">
        <p className=" mb-6 text-2xl font-bold">OUR PHILOSOPHY</p>
        <p className=" text-[#888888]">
          Information is power. Blacklist guards who bring disrepute to your
          company and the industry, check guards who you would like to employ
          and receive CVs of guards looking for work online..
        </p>
      </div>
      <div className="text-white p-5 w-4/12">
        <p className=" mb-6 text-2xl font-bold">ABOUT OUR COMPANY</p>
        <p className=" text-[#888888]">
          Information is power. Blacklist guards who bring disrepute to your
          company and the industry, check guards who you would like to employ
          and receive CVs of guards looking for work online..
        </p>
      </div>
      <div className="text-white p-2 flex flex-col gap-1 justify-around">
        <p className=" mb-6 text-2xl font-bold">Contact Us</p>
        <div>
          <p className=" text-sm">012-492-9089</p>
        </div>
        <div>
          <p className=" text-sm">info@guardcheck.com</p>
        </div>
        <div>
          <p className=" text-sm">
            Postnet Suite 103, Private bag X0003, Ifafi, 0260
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
