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
  Mail,
  Send,
  Users,
  CheckSquare,
  Square,
} from "lucide-react";

const EmailMembers = () => {
  const router = useRouter();

  // User accounts data
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Email form data
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });

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
          (account.cell_no || "").includes(searchTerm)
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

  // Handle individual user selection
  const handleUserSelect = (userId, isSelected) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (isSelected) {
      newSelectedUsers.add(userId);
    } else {
      newSelectedUsers.delete(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedUsers.size === currentData.length) {
      // If all current page items are selected, deselect all
      setSelectedUsers(new Set());
    } else {
      // Select all current page items
      const newSelectedUsers = new Set();
      currentData.forEach((account) => {
        newSelectedUsers.add(account.id);
      });
      setSelectedUsers(newSelectedUsers);
    }
  };

  // Get selected users data
  const getSelectedUsersData = () => {
    return accountsData.filter((account) => selectedUsers.has(account.id));
  };

  // Handle email modal
  const openEmailModal = () => {
    if (selectedUsers.size === 0) {
      alert("Please select at least one user to send email to.");
      return;
    }
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailData({ subject: "", message: "" });
  };

  // Handle sending email
  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!emailData.subject.trim() || !emailData.message.trim()) {
      alert("Please fill in both subject and message fields.");
      return;
    }

    setSendingEmail(true);

    try {
      const selectedUsersData = getSelectedUsersData();

      const response = await fetch("/api/admin/send-bulk-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: selectedUsersData.map((user) => ({
            email: user.email,
            name: user.contact_person,
            company: user.company_name,
          })),
          subject: emailData.subject,
          message: emailData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`Email sent successfully to ${selectedUsers.size} recipients!`);
        closeEmailModal();
        setSelectedUsers(new Set()); // Clear selections
      } else {
        alert(`Failed to send email: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Mobile Card Component for displaying accounts
  const MobileCard = ({ account, index }) => {
    const isSelected = selectedUsers.has(account.id);

    return (
      <div
        className={`p-4 rounded-lg border ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        } mb-4`}>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {/* Selection checkbox */}
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="font-semibold text-gray-600">Select:</span>
            <button
              onClick={() => handleUserSelect(account.id, !isSelected)}
              className="flex items-center gap-2 p-1">
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Company:</span>
            <span className="text-gray-800">{account.company_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Contact Person:</span>
            <span className="text-gray-800">{account.contact_person}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Cell Number:</span>
            <span className="text-gray-800">{account.cell_no}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800 break-all">{account.email}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center py-8 px-4 sm:py-16 lg:py-28">
        <p className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 lg:mb-8">
          EMAIL MEMBERS
        </p>

        {/* Search Section */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md lg:w-[50%]">
            <input
              onChange={(e) => handleChange(e.target.value)}
              className="shadow-xl bg-white w-full p-4 lg:p-6 pr-12 lg:pr-16 rounded-lg"
              placeholder="Search by company, contact person, or email..."
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
            {/* Left side controls */}
            <div className="flex items-center gap-4 flex-wrap">
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

            {/* Right side - Selection info and actions */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{selectedUsers.size} selected</span>
              </div>

              {selectedUsers.size > 0 && (
                <button
                  onClick={openEmailModal}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  Send Email ({selectedUsers.size})
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <div className="sm:hidden mb-4">
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

          <div className={`${showFilters ? "block" : "hidden"} sm:block mb-4`}>
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

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center gap-2 hover:text-blue-600">
                      {selectedUsers.size === currentData.length &&
                      currentData.length > 0 ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      Select All
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Company Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Contact Person
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Cell Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500">
                      Loading accounts...
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((account, index) => {
                    const isSelected = selectedUsers.has(account.id);

                    return (
                      <tr
                        key={account.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } ${
                          isSelected ? "ring-2 ring-blue-200 bg-blue-50" : ""
                        }`}>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() =>
                              handleUserSelect(account.id, !isSelected)
                            }
                            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded">
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.company_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.contact_person}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {account.cell_no}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 break-all">
                          {account.email}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Send Email to Selected Members
              </h3>
              <button
                onClick={closeEmailModal}
                className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-100 rounded">
              <p className="text-sm text-gray-600">
                <strong>Recipients:</strong> {selectedUsers.size} selected
                members
              </p>
              <div className="mt-2 max-h-32 overflow-y-auto">
                {getSelectedUsersData().map((user) => (
                  <div key={user.id} className="text-xs text-gray-500">
                    • {user.company_name} ({user.email})
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendEmail}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter email subject"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Enter your message here..."
                  required
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className={`flex items-center gap-2 px-6 py-2 text-white rounded transition-colors ${
                    sendingEmail
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}>
                  <Send className="w-4 h-4" />
                  {sendingEmail ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EmailMembers;
