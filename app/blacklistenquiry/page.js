"use client";

import React, { useState, useMemo } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

const BlacklistEnquiry = () => {
  const router = useRouter();

  const [blacklistData, setBlacklistData] = useState([]);

  const [input, setInput] = useState();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  // Mobile Card Component for displaying records
  const MobileCard = ({ record, index }) => (
    <div
      className={`p-4 rounded-lg border ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } mb-4`}>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Company:</span>
          <span className="text-gray-800">
            {record.registeredBy.companyName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Contact Person:</span>
          <span className="text-gray-800">{record.registeredBy.username}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Phone:</span>
          <span className="text-gray-800">
            {record.registeredBy.phoneNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Guard Name:</span>
          <span className="text-gray-800">
            {record.guardName} {record.surname}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Gender:</span>
          <span className="text-gray-800">{record.gender}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">ID Number:</span>
          <span className="text-gray-800">{record.idNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">SIRA/SOB No:</span>
          <span className="text-gray-800">{record.siraSobNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Date:</span>
          <span className="text-gray-800">{record.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Reason:</span>
          <span className="text-gray-800">{record.reason}</span>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <span className="font-semibold text-gray-600">Description:</span>
          <p className="text-gray-800 mt-1">{record.description}</p>
        </div>
        {record.other && (
          <div className="pt-2">
            <span className="font-semibold text-gray-600">Other:</span>
            <p className="text-gray-800 mt-1">{record.other}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="text-center py-8 px-4 sm:py-16 lg:py-28">
        <p className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 lg:mb-8">
          BLACK LIST ENQUIRY
        </p>

        {/* Search Section */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md lg:w-[50%]">
            <input
              onChange={(e) => handleChange(e.target.value)}
              className="shadow-xl bg-white w-full p-4 lg:p-6 pr-12 lg:pr-16 rounded-lg"
              placeholder="Enter PSIRA / SOB No / or ID"
            />
            <button
              className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                handleSearch();
              }}>
              <Search className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            handleSearch();
          }}
          className=" px-3 py-2 mt-1 bg-[#14a2b8] rounded-md text-white font-normal hover:bg-[#0f8a9e] transition-colors">
          Search
        </button>

        {/* Results Section */}
        <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 bg-white rounded-lg shadow-sm">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Entries per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            {/* Search - Mobile Toggle */}
            <div className="w-full sm:w-auto">
              <div className="sm:hidden mb-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded w-full justify-center">
                  {showFilters ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                  {showFilters ? "Hide Search" : "Show Search"}
                </button>
              </div>

              <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Search:
                  </span>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search blacklist records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm w-full sm:w-64"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
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
                        {record.registeredBy.companyName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.registeredBy.username}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.registeredBy.phoneNumber}
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

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {currentData.length > 0 ? (
              currentData.map((record, index) => (
                <MobileCard key={record.id} record={record} index={index} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg">
                No blacklist records found matching your search criteria.
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              entries
              {searchTerm &&
                ` (filtered from ${blacklistData.length} total entries)`}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-2 sm:px-3 py-2 text-sm border rounded ${
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
                  className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center w-full mt-6">
          <button
            onClick={handleBack}
            className="bg-[#14A2B8] rounded-md text-white font-normal p-3 px-6 hover:bg-[#0f8a9e] transition-colors">
            Back
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlacklistEnquiry;
