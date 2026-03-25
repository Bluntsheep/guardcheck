"use client";
import Menubar from "./components/menubar/menubar";
import Footer from "./components/footer/footer";
import CvUpdateFull from "./components/cvUpdateFull";
import CvUpdatemobile from "./components/cvUpdateMobile";

export default function Home() {
  return (
    <div>
      {/* Hero / intro section */}
      <div className="flex flex-col items-center justify-center py-10 md:py-18 px-4 bg-[#F9F9F9]">
        <p className="text-2xl sm:text-3xl md:text-5xl font-bold mt-8 text-center leading-tight">
          Welcome to GUARDCHECK.COM
        </p>
        <p className="text-sm sm:text-base text-red-600 mt-4 text-center">
          Warning: Security Industry Only!
        </p>
        <p className="text-center text-slate-400 font-medium mt-4 text-sm sm:text-base max-w-xl px-2">
          Information is power. Blacklist guards who bring disrepute to your
          company and the industry, check guards who you would like to employ
          and receive CVs of guards looking for work online.
        </p>
        <p className="font-bold text-base sm:text-lg text-[#167BA9] mt-4 text-center px-2">
          UPLOAD YOUR CV FOR FREE TO GUARDCHECK.COM.
        </p>
      </div>

      {/* CV forms — each handles its own visibility via Tailwind breakpoints */}
      <CvUpdateFull />
      <CvUpdatemobile />

      {/* About section */}
      <div className="flex flex-col items-center justify-center mt-10 md:mt-16 bg-[#808080] px-6 md:px-36 py-10 md:py-24">
        <p className="text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8 text-[#212529] font-bold text-center">
          About Us
        </p>
        <p className="text-white text-center mt-4 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
          All members of GUARDCHECK.COM will be able to receive information on
          black listed security guards and black list security guards from their
          PC. To view CVs of security guards looking for work you must be a
          member of GUARDCHECK.COM. The placing of CVs on GUARDCHECK.COM is FREE
          to all security guards in South Africa and goes to about 4000 security
          companies.
        </p>
      </div>

      <Footer />
    </div>
  );
}
