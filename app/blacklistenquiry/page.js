"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Printer,
} from "lucide-react";

// Mock components - replace with your actual imports
const Footer = () => (
  <div className="bg-gray-800 text-white p-4 text-center">Footer Content</div>
);

const BlacklistEnquiry = () => {
  const router = useRouter();

  const [blacklistData, setBlacklistData] = useState([]);
  const [input, setInput] = useState();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

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

  const handlePrintReport = (record) => {
    setIsPrinting(true);

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      // Create the print document with professional styling
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blacklist Report - ${record.guardName} ${
        record.surname
      }</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 40px 20px;
              font-size: 14px;
            }
            
            .report-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            
            .report-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #dc3545;
            }
            
            .report-header h1 {
              font-size: 28px;
              color: #dc3545;
              margin-bottom: 8px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .report-header .subtitle {
              font-size: 11px;
              color: #6c757d;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .alert-box {
              background: #f8d7da;

              border-radius: 8px;
              padding: 10px;
              margin-bottom: 10px;
              text-align: center;
            }
            
            .alert-box h2 {
              color: #721c24;
              font-size: 24px;
              margin-bottom: 10px;
              font-weight: 700;
            }
            
            .alert-box p {
              color: #721c24;
              font-size: 12px;
              font-weight: 600;
            }
            
            .section {
              margin-bottom: 30px;
            }
            
            .section h3 {
              color: #495057;
              font-size: 18px;
              margin-bottom: 15px;
              font-weight: 700;
              border-left: 4px solid #dc3545;
              padding-left: 15px;
              background: #f8f9fa;
              padding-top: 10px;
              padding-bottom: 10px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 5px;
              border: 1px solid #e9ecef;
            }
            
            .info-label {
              font-weight: 700;
              color: #495057;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            
            .info-value {
              color: #212529;
              font-size: 14px;
              font-weight: 500;
            }
            
            .full-width {
              grid-column: 1 / -1;
            }
            
            .reason-box {
              background: #fff3cd;
              border: 2px solid #ffc107;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            
            .reason-box h4 {
              color: #856404;
              font-size: 16px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            
            .reason-box p {
              color: #856404;
              font-size: 14px;
              line-height: 1.6;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              padding-top: 20px;
              border-top: 2px solid #dee2e6;
            }
            
            .footer p {
              color: #6c757d;
              font-size: 12px;
              margin-bottom: 5px;
            }
            
            .warning-text {
              color: #dc3545;
              font-weight: 700;
              font-size: 16px;
              text-align: center;
              margin-top: 20px;
              padding: 10px;
              background: #f8d7da;
              border-radius: 5px;
            }
            
            /* Print specific styles */
            @media print {
              body {
                padding: 20px 15px;
                font-size: 12px;
              }
              
              .report-container {
                box-shadow: none;
              }
              
              .alert-box {
                background: #f0f0f0 !important;
                border: 2px solid #000 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .section h3 {
                background: #f0f0f0 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .info-item {
                background: #f8f8f8 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .reason-box {
                background: #f5f5f5 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            
            @media (max-width: 600px) {
              .info-grid {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="report-header">
              <h3>Security Guard Blacklist Report</h3>
              <div class="subtitle">Confidential Document</div>
            </div>
            
            <div class="section">
              <h3>Personal Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">First Name</div>
                  <div class="info-value">${record.guardName || "N/A"}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Surname</div>
                  <div class="info-value">${record.surname || "N/A"}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Gender</div>
                  <div class="info-value">${record.gender || "N/A"}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ID Number</div>
                  <div class="info-value">${record.idNumber || "N/A"}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">PSIRA Number</div>
                  <div class="info-value">${record.siraSobNo || "N/A"}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Reporting Company Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Company Name</div>
                  <div class="info-value">${
                    record.registeredBy?.companyName || "N/A"
                  }</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Contact Person</div>
                  <div class="info-value">${
                    record.registeredBy?.username || "N/A"
                  }</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">${
                    record.registeredBy?.phoneNumber || "N/A"
                  }</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Blacklist Details</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Date Blacklisted</div>
                  <div class="info-value">${record.date || "N/A"}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Reason Category</div>
                  <div class="info-value">${record.reason || "N/A"}</div>
                </div>
              </div>
              
              <div class="reason-box">
                <h4>Detailed Description</h4>
                <p>${
                  record.description || "No detailed description provided."
                }</p>
              </div>
              
              ${
                record.other
                  ? `
                <div class="reason-box">
                  <h4>Additional Information</h4>
                  <p>${record.other}</p>
                </div>
              `
                  : ""
              }
            </div>
            
            <div class="footer">
              <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p><strong>Document Type:</strong> Security Guard Blacklist Report</p>
              <p><strong>Status:</strong> Confidential</p>
            </div>
          </div>
          
          <script>
            // Auto-print when page loads
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
              
              // Close window after printing
              window.onafterprint = function() {
                setTimeout(function() {
                  window.close();
                }, 1000);
              };
              
              // Fallback close after 15 seconds
              setTimeout(function() {
                window.close();
              }, 15000);
            };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
    } else {
      alert(
        "Pop-up blocked! Please allow pop-ups for this site to print the blacklist report."
      );
    }

    setIsPrinting(false);
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
          <span className="font-semibold text-gray-600">SIRA No:</span>
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

        {/* Print Button for Mobile */}
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={() => handlePrintReport(record)}
            disabled={isPrinting}
            className={`w-full bg-red-600 rounded-md text-white font-normal p-2 px-4 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 ${
              isPrinting ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            <Printer className="w-4 h-4" />
            {isPrinting ? "Preparing Report..." : "Print Blacklist Report"}
          </button>
        </div>
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
              placeholder="Enter PSIRA No / or ID"
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
                    Sira No
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
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
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
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handlePrintReport(record)}
                          disabled={isPrinting}
                          className={`bg-red-600 rounded-md text-white font-normal p-2 px-3 hover:bg-red-700 transition-colors flex items-center gap-1 mx-auto ${
                            isPrinting ? "opacity-50 cursor-not-allowed" : ""
                          }`}>
                          <Printer className="w-4 h-4" />
                          Print
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={13}
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
