"use client";

import React, { useState, useMemo, useEffect } from "react";

import Footer from "../../components/footer/footer";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";

const Member = () => {
  const router = useRouter();

  // User accounts data
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  // Helper function to check if account is active (handles different data types)
  const isAccountActive = (active) => {
    return active === 1 || active === "1" || active === true;
  };

  const filteredData = useMemo(() => {
    let filtered = accountsData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          (account.company_name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (account.contact_person || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (account.email || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (account.d_user || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (account.phone_no || "").includes(searchTerm) ||
          (account.cell_no || "").includes(searchTerm) ||
          (account.sira_sob_no || "").includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((account) => {
        const isActive = isAccountActive(account.active);
        return statusFilter === "active" ? isActive : !isActive;
      });
    }

    // Sort alphabetically by company name
    filtered.sort((a, b) => {
      const nameA = (a.company_name || "").toLowerCase();
      const nameB = (b.company_name || "").toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [accountsData, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchTerm, statusFilter, sortOrder]);

  // Load all accounts on component mount
  useEffect(() => {
    loadAllAccounts();
  }, []);

  const loadAllAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/accounts");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("Accounts loaded:", data.data);
        setAccountsData(data.data);
      } else {
        console.error("Failed to load accounts:", data.error);
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!input || input.trim() === "") {
      loadAllAccounts(); // Load all if no search term
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/searchaccounts?term=${encodeURIComponent(input.trim())}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("Search results:", data.data);
        setAccountsData(data.data);

        if (data.total === 0) {
          console.log("No accounts found for the search term");
        }
      } else {
        console.error("Search failed:", data.error);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleChange = (input) => {
    setInput(input);
  };

  // New function to handle edit profile
  const handleEditProfile = (account) => {
    // Store the account data in sessionStorage for the update profile page
    const accountData = {
      success: true,
      user: {
        id: account.id,
        company_name: account.company_name,
        contact_person: account.contact_person,
        sira_sob_no: account.sira_sob_no,
        phone_no: account.phone_no,
        d_user: account.d_user,
        company_reg_no: account.company_reg_no || "",
        pobox: account.pobox || "",
        zipcode: account.zipcode || "",
        cell_no: account.cell_no,
        email: account.email,
      },
    };

    // Store in sessionStorage with a key that indicates this is admin editing
    sessionStorage.setItem("adminEditUser", JSON.stringify(accountData));

    // Navigate to the existing update profile page
    router.push("/updateprofile");
  };

  // Mobile Card Component for displaying accounts
  const MobileCard = ({ account, index }) => {
    const isActive = isAccountActive(account.active);

    return (
      <div
        className={`p-4 rounded-lg border ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        } mb-4`}>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Company:</span>
            <span className="text-gray-800">{account.company_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Username:</span>
            <span className="text-gray-800">{account.d_user}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Contact Person:</span>
            <span className="text-gray-800">{account.contact_person}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{account.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Phone:</span>
            <span className="text-gray-800">{account.phone_no}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Cell:</span>
            <span className="text-gray-800">{account.cell_no}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">PSIRA:</span>
            <span className="text-gray-800">{account.sira_sob_no}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">
              Registration Date: {account.reg_date}
            </span>
            {/* <span className="text-gray-800">
              {new Date(account.reg_date).toLocaleDateString()}
            </span> */}
          </div>

          {/* Action Button for Mobile */}
          <div className="pt-3 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => handleEditProfile(account)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm bg-blue-500 text-white hover:bg-blue-600">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center py-8 px-4 sm:py-16 lg:py-28">
        <p className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 lg:mb-8">
          MEMBERS MANAGEMENT
        </p>

        {/* Search Section */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md lg:w-[50%]">
            <input
              onChange={(e) => handleChange(e.target.value)}
              className="shadow-xl bg-white w-full p-4 lg:p-6 pr-12 lg:pr-16 rounded-lg"
              placeholder="Search by company, username, email, or phone..."
              value={input}
            />
            <button
              className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleSearch}
              disabled={loading}>
              <Search className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 bg-white rounded-lg shadow-sm">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Entries per page and Status Filter */}
            <div className="flex items-center gap-4">
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

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="all">All Accounts</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
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
                      placeholder="Filter accounts..."
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
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Company Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Contact Person
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    PSIRA/SOB
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Registration Date
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-gray-500">
                      Loading accounts...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((account, index) => {
                    const isActive = isAccountActive(account.active);

                    return (
                      <tr
                        key={account.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.company_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.d_user}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.contact_person}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.phone_no}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.sira_sob_no}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(account.reg_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleEditProfile(account)}
                            className="flex items-center gap-1 px-3 py-1 rounded hover:opacity-80 transition-colors text-sm mx-auto bg-blue-500 text-white"
                            title="Edit Profile">
                            <Edit className="w-4 h-4" />
                            Edit Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No accounts found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading accounts...
              </div>
            ) : currentData.length > 0 ? (
              currentData.map((account, index) => (
                <MobileCard key={account.id} account={account} index={index} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg">
                No accounts found matching your search criteria.
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              entries
              {(searchTerm || statusFilter !== "all") &&
                ` (filtered from ${accountsData.length} total entries)`}
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
            Back to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Member;
