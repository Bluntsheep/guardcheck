import Image from "next/image";
import Menubar from "./components/menubar/menubar";
import { FaRegCopy } from "react-icons/fa";
import Footer from "./components/footer/footer";

export default function Home() {
  return (
    <div>
      <Menubar />
      <div className="flex flex-col items-center justify-center  py-18 bg-[#F9F9F9">
        <Image src="/labournet.png" alt="" width={300} height={2000} />
        <p className=" text-3xl  md:text-5xl font-bold mt-8">
          Welcome to Guard Check
        </p>
        <p className=" text-1xl text-red-600 mt-4">
          Warning: Security Industry Only!
        </p>
        <p className="text-center text-slate-400 font-medium mt-4 p-3">
          Information is power. Blacklist guards who bring disrepute to your
          company and the
          <br /> industry, check guards who you would like to employ and receive
          CVs of guards looking
          <br /> for work online.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-3 md:py-12 mt-16 bg-[#FAFAFA]">
        <div className="flex">
          <div className="flex flex-col items-center justify-center p-3 md:p-32 bg-[#167BA9]">
            <div className=" bg-white p-8 rounded-full">
              <FaRegCopy color="grey" size={100} />
            </div>
            <div className="flex flex-col text-center text-white font-bold text-2xl mt-12">
              <p>SUBMIT</p>
              <p>SECURITY</p>
              <p>GUARD CV</p>
            </div>
          </div>
          <div className="bg-white flex flex-col justify-between px-3">
            <div className="flex gap-8 mx-8">
              <input className=" bg-slate-200 p-3 text-lg" placeholder="Name" />
              <input
                className=" bg-slate-200 p-3 text-lg"
                placeholder="Surname"
              />
            </div>
            <div className="flex gap-8 mx-8">
              <input
                className=" bg-slate-200 p-3 text-lg"
                placeholder="Id Number"
              />
              <input
                className=" bg-slate-200 p-3 text-lg"
                placeholder="PSIR / SOB Number"
              />
            </div>
            <div className="flex gap-8 mx-8">
              <input
                className=" bg-slate-200 p-3 text-lg"
                placeholder="Phone"
              />
              <input
                className=" bg-slate-200 p-3 text-lg"
                placeholder="Region"
              />
            </div>
            <div className="flex gap-8 mx-8">
              <input className=" bg-slate-200 p-3 text-lg" placeholder="Town" />
              <input
                className=" bg-slate-200 p-3 text-lg"
                placeholder="Select Highest Grade"
              />
            </div>
            <div className="flex gap-8 justify-center text-xs">
              <div>
                <label>
                  <input type="radio" />
                  <span className="ml-2">Male</span>
                </label>
              </div>
              <div>
                <label>
                  <input type="radio" />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>
            <div className="flex gap-8 justify-center">
              <textarea
                className=" w-[90%] bg-slate-200 p-3"
                rows={5}
                placeholder="Personal Experience"
              />
            </div>
            <div className=" text-xs pl-3">
              <p>Guard Type:</p>
            </div>
            <div className="text-xs px-5 flex gap-2 justify-around">
              <label className="ml-2">
                <input type="checkbox" name="Security guard" />
                <span className="ml-2">Security guard</span>
              </label>
              <label className="ml-2">
                <input type="checkbox" name="Security guard" />
                <span className="ml-2">Armed response</span>
              </label>
              <label className="ml-2">
                <input type="checkbox" name="Security guard" />
                <span className="ml-2">Control room</span>
              </label>
            </div>
            <button className="bg-[#167BA9] text-white p-3 mt-4 rounded-md w-[30%]  self-center">
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-16 bg-[#808080] px-6 md:px-36 py-6 md:py-24">
        <p className=" text-5xl mb-8 text-[#212529] font-bold">About Us</p>
        <p className="text-white text-center mt-4 text-lg">
          All members of guardcheck.com will be able to receive information on
          black listed security guards and black list security guards from their
          PC. To view CVs of security guards looking for work you must be a
          member of guardcheck.com. The placing of CVs on guardcheck.com is FREE
          to all security guards in South Africa and goes to about 4000 security
          companies.
        </p>
      </div>
      <Footer />
    </div>
  );
}
