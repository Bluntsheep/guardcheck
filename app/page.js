import Menubar from "./components/menubar/menubar";
import Footer from "./components/footer/footer";
import CvUpdateFull from "./components/cvUpdateFull";
import CvUpdatemobile from "./components/cvUpdateMobile";

export default function Home() {
  return (
    <div>
      <Menubar />
      <div className="flex flex-col items-center justify-center  py-18 bg-[#F9F9F9">
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
      <CvUpdateFull />
      <CvUpdatemobile />
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
