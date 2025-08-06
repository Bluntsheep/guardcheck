"use client";

import React, { useState, useMemo } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const BlacklistEnquiry = () => {
  const router = useRouter();

  // Sample blacklist data - replace with your actual data
  const [blacklistData, setBlacklistData] = useState([
    // {
    //   id: 1,
    //   companyName: "ABC Security",
    //   contactPerson: "John Smith",
    //   phoneNumber: "011-123-4567",
    //   guardName: "Michael",
    //   surname: "Johnson",
    //   gender: "Male",
    //   idNumber: "8801015800083",
    //   siraSobNo: "123456789",
    //   date: "2024-01-15",
    //   reason: "Misconduct",
    //   description: "Failed to report for duty",
    //   other: "Additional notes",
    // },
  ]);

  const [input, setInput] = useState();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return blacklistData;

    return blacklistData.filter(
      (record) =>
        (record.companyName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (record.contactPerson || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (record.phoneNumber || "").includes(searchTerm) ||
        (record.guardName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (record.surname || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (record.idNumber || "").includes(searchTerm) ||
        (record.siraSobNo || "").includes(searchTerm) ||
        (record.reason || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blacklistData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchTerm]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleBack = () => {
    router.push("/payment");
  };

  const handleChange = (input) => {
    setInput(input);
  };

  const handleSearch = async () => {
    if (!input || input.trim() === "") {
      console.log("Please enter a search term");
      return;
    }

    try {
      const response = await fetch(
        `/api/findguards?idnum=${encodeURIComponent(
          input.trim()
        )}&snum=${encodeURIComponent(input.trim())}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("Search results:", data.data);
        console.log(`Found ${data.total} records`);

        setBlacklistData(data.data);

        if (data.total === 0) {
          console.log("No records found for the search term");
        }
      } else {
        console.error("Search failed:", data.error);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div>
      <div className=" text-center my-28">
        <p className=" text-5xl font-bold mb-8">BLACK LIST ENQUIRY</p>
        <div className="flex justify-center">
          <div className=" relative w-[50%]">
            <input
              onChange={(e) => handleChange(e.target.value)}
              className="shadow-xl bg-white w-full p-6 pr-16"
              placeholder="Enter PSIRA / SOB No / or ID"
            />
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                handleSearch();
              }}>
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="w-[90%] max-w-7xl mx-auto p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search blacklist records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Company Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Contact Person
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Guard Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Surname
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    ID Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Sira / Sob No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Other
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((record, index) => (
                    <tr
                      key={record.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.companyName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.contactPerson}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.guardName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.surname}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.gender}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.idNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.siraSobNo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.reason}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.other}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No blacklist records found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              entries
              {searchTerm &&
                ` (filtered from ${blacklistData.length} total entries)`}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-2 text-sm border rounded ${
                          currentPage === pageNum
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-8 w-full mt-6">
          <button
            onClick={handleBack}
            className="bg-[#14A2B8] rounded-md text-white font-normal p-2 px-3 mt-2 ">
            Back
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlacklistEnquiry;
