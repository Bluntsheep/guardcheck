import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";

const GuardTable = ({ province, handleCV }) => {
  // Sample data - replace with your actual data
  const [guards, setGuards] = useState([]);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter guards based on search term
  // Filter guards based on search term
  const filteredGuards = useMemo(() => {
    if (!searchTerm) return guards;

    return guards.filter(
      (guard) =>
        (guard.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guard.surname || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (guard.phone || "").includes(searchTerm) ||
        (guard.grade || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guard.guardType || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [guards, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredGuards.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentGuards = filteredGuards.slice(startIndex, endIndex);

  // Reset to first page when entries per page or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, searchTerm]);

  const handleViewCV = (cvUrl, guardName) => {
    // alert(`Viewing CV for ${guardName}\nCV URL: ${cvUrl}`);
    setCurrentCV();
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    const fetchGuardsByArea = async () => {
      const area = province;

      if (!area) return;

      try {
        const response = await fetch(
          `/api/cvUpload?area=${encodeURIComponent(area)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setGuards(data.data);
          console.log(`Found ${data.total} guards in ${area}`);
        } else {
          setError(data.error || "Failed to fetch guards");
        }
      } catch (err) {
        console.error("Error fetching guards:", err);
      } finally {
      }
    };

    fetchGuardsByArea();
  }, [province]);

  return (
    <div className="w-[70%] max-w-6xl mx-auto p-6 bg-white">
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
              placeholder="Search guards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded pl-10 pr-4 py-2 text-sm  w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className=" px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className=" px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Surname
              </th>
              <th className=" px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Phone Number
              </th>
              <th className=" px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Highest Grade
              </th>
              <th className=" px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Guard Type
              </th>
              <th className=" px-4 py-3 text-center text-sm font-semibold text-gray-700">
                View CV
              </th>
            </tr>
          </thead>
          <tbody>
            {currentGuards.length > 0 ? (
              currentGuards.map((guard, index) => (
                <tr
                  key={guard.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className=" px-4 py-3 text-sm text-gray-700">
                    {guard.name}
                  </td>
                  <td className=" px-4 py-3 text-sm text-gray-700">
                    {guard.surname}
                  </td>
                  <td className=" px-4 py-3 text-sm text-gray-700">
                    {guard.phone}
                  </td>
                  <td className=" px-4 py-3 text-sm text-gray-700">
                    {guard.grade}
                  </td>
                  <td className=" px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium">
                      {guard.guardType}
                    </span>
                  </td>
                  <td className=" px-4 py-3 text-center">
                    <button
                      onClick={() => handleCV(guard)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#14A2B8] text-white text-sm rounded hover:bg-[#118496] transition-colors">
                      View CV
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No guards found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredGuards.length)} of {filteredGuards.length}{" "}
          entries
          {searchTerm && ` (filtered from ${guards.length} total entries)`}
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
  );
};

export default GuardTable;
