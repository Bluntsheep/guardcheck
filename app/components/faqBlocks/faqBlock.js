import React from "react";
import { FaArrowDown, FaChevronDown, FaChevronRight } from "react-icons/fa";

const FaqBlock = ({ selectedTab, updateTab, index, heading, content }) => {
  return (
    <div className=" w-full shadow-lg mb-10">
      <div
        onClick={(e) => updateTab(e, index)}
        className=" flex bg-[#167BA9] p-4 text-white font-medium justify-between">
        <p>{heading}</p>
        {index === selectedTab ? (
          <FaChevronDown className="text-white" />
        ) : (
          <FaChevronRight className="text-white" />
        )}
      </div>
      <div
        className={`w-full p-4 bg-white border-l-1 border-r-1 border-b-1 border-slate-200 ${
          selectedTab === index ? "block" : "hidden"
        }`}>
        <p> {content}</p>
      </div>
    </div>
  );
};

export default FaqBlock;
