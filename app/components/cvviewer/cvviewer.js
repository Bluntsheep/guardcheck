import React, { useState } from "react";
import { Printer } from "lucide-react";

const Cvviewer = ({ currentCV, handleCV }) => {
  const cv = currentCV;
  const [isPrinting, setIsPrinting] = useState(false);

  console.log(cv);

  const cvFields = [
    { label: "Name", value: cv.name },
    { label: "Surname", value: cv.surname },
    { label: "Gender", value: cv.gender },
    { label: "ID Number", value: cv.idNumber },
    { label: "Sira / Sob No", value: cv.siraNumber },
    { label: "Phone Number", value: cv.phone },
    { label: "Province", value: cv.area },
    { label: "Town", value: cv.town },
    { label: "Highest Grade", value: cv.grade },
    { label: "Guard Type", value: cv.guardType },
    { label: "Previous Experience", value: cv.experience },
  ];

  const handlePrint = () => {
    setIsPrinting(true);

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      // Get the CV content
      const cvContent = document.getElementById("cv-print-content");

      if (cvContent) {
        // Create the print document with professional styling
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>CV - ${cv.name} ${cv.surname}</title>
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
              
              .cv-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
              }
              
              .cv-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #14A2B8;
              }
              
              .cv-header h1 {
                font-size: 32px;
                color: #2c3e50;
                margin-bottom: 8px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              
              .cv-header .subtitle {
                font-size: 16px;
                color: #14A2B8;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              
              .cv-content {
                background: white;
              }
              
              .cv-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
              }
              
              .cv-table tr:nth-child(odd) {
                background-color: #f8f9fa;
              }
              
              .cv-table tr:nth-child(even) {
                background-color: white;
              }
              
              .cv-table td {
                padding: 16px 20px;
                border: 1px solid #e9ecef;
                vertical-align: top;
              }
              
              .field-label {
                font-weight: 700;
                color: #2c3e50;
                background-color: #f1f3f4 !important;
                width: 200px;
                min-width: 200px;
                border-right: 3px solid #14A2B8 !important;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.5px;
              }
              
              .field-value {
                color: #495057;
                font-weight: 400;
                word-wrap: break-word;
                background-color: white !important;
              }
              
              .experience-field .field-value {
                line-height: 1.8;
              }
              
              .footer {
                margin-top: 40px;
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
              }
              
              .footer p {
                color: #6c757d;
                font-size: 12px;
                font-style: italic;
              }
              
              /* Print specific styles */
              @media print {
                body {
                  padding: 20px 15px;
                  font-size: 12px;
                }
                
                .cv-container {
                  box-shadow: none;
                }
                
                .cv-header h1 {
                  font-size: 28px;
                }
                
                .cv-table {
                  box-shadow: none;
                }
                
                .cv-table tr:nth-child(odd) {
                  background-color: #f5f5f5 !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .field-label {
                  background-color: #e9ecef !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                /* Ensure page breaks work well */
                .cv-table {
                  page-break-inside: avoid;
                }
                
                .cv-header {
                  page-break-after: avoid;
                }
              }
              
              /* Handle long content gracefully */
              .field-value {
                max-width: 400px;
                word-break: break-word;
              }
            </style>
          </head>
          <body>
            <div class="cv-container">
              <div class="cv-header">
                <h1>${cv.name} ${cv.surname}</h1>
                <div class="subtitle">Security Guard CV</div>
              </div>
              
              <div class="cv-content">
                <table class="cv-table">
                  ${cvFields
                    .map(
                      (field) => `
                    <tr class="${
                      field.label.toLowerCase().includes("experience")
                        ? "experience-field"
                        : ""
                    }">
                      <td class="field-label">${field.label}</td>
                      <td class="field-value">${field.value || "N/A"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
              </div>
              
              <div class="footer">
                <p>Generated CV - ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <script>
              // Auto-print when page loads
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
                
                // Close window after printing (optional)
                window.onafterprint = function() {
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                };
                
                // Fallback close after 10 seconds
                setTimeout(function() {
                  window.close();
                }, 10000);
              };
            </script>
          </body>
          </html>
        `);

        printWindow.document.close();
      }
    } else {
      alert(
        "Pop-up blocked! Please allow pop-ups for this site to print the CV."
      );
    }

    setIsPrinting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl lg:w-[60%]">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl text-slate-600 font-bold break-words">
              {cv.name}
            </h1>
          </div>

          {/* CV Content - Add ID for print targeting */}
          <div
            id="cv-print-content"
            className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              {cvFields.map((field, index) => (
                <div key={index} className="flex w-full">
                  <div className="w-2/12 lg:w-3/12 text-left border-slate-200 border-[1px] bg-gray-50">
                    <p className="text-slate-800 font-bold p-3 lg:p-4 text-sm lg:text-base">
                      {field.label}
                    </p>
                  </div>
                  <div className="w-10/12 lg:w-9/12 text-left border-slate-200 border-[1px]">
                    <p className="text-slate-500 p-3 lg:p-4 text-sm lg:text-base break-words">
                      {field.value || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {cvFields.map((field, index) => (
                <div
                  key={index}
                  className={`p-4 ${
                    index !== cvFields.length - 1
                      ? "border-b border-slate-200"
                      : ""
                  }`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <span className="text-slate-800 font-bold text-sm min-w-0">
                      {field.label}:
                    </span>
                    <span className="text-slate-500 text-sm break-words flex-1 sm:text-right">
                      {field.value || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className={`bg-green-600 rounded-md text-white font-normal p-3 px-6 lg:p-2 lg:px-4 hover:bg-green-700 transition-colors touch-manipulation flex items-center gap-2 ${
                isPrinting ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              <Printer className="w-4 h-4" />
              {isPrinting ? "Preparing..." : "Print CV"}
            </button>

            {/* Back Button */}
            <button
              onClick={() => handleCV("")}
              className="bg-[#14A2B8] rounded-md text-white font-normal p-3 px-6 lg:p-2 lg:px-3 hover:bg-[#0f8a9e] transition-colors touch-manipulation">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cvviewer;
