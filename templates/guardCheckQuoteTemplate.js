export default function GuardriskQuoteTemplate({ quoteData }) {
  // Default data structure - replace with your actual props
  const data = quoteData || {
    quoteNumber: "QUO-2025-001",
    quoteDate: "2025-01-15",
    validUntil: "2025-02-14",
    status: "pending",
    company: {
      name: "Guardrisk Insurance Company",
      address: "123 Business Street",
      city: "Cape Town, 8001",
      phone: "+27 21 123 4567",
      email: "quotes@guardrisk.co.za",
      website: "www.guardrisk.co.za",
    },
    client: {
      name: "ABC Construction Ltd",
      contactPerson: "John Smith",
      address: "456 Industrial Ave",
      city: "Johannesburg, 2001",
      phone: "+27 11 987 6543",
      email: "john@abcconstruction.co.za",
    },
    items: [
      {
        id: 1,
        description: "Public Liability Insurance",
        coverage: "R5,000,000",
        premium: 15000.0,
        quantity: 1,
      },
      {
        id: 2,
        description: "Professional Indemnity Insurance",
        coverage: "R2,000,000",
        premium: 8500.0,
        quantity: 1,
      },
      {
        id: 3,
        description: "Contractor's All Risk Insurance",
        coverage: "R10,000,000",
        premium: 12000.0,
        quantity: 1,
      },
    ],
    subtotal: 35500.0,
    vat: 5325.0,
    total: 40825.0,
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ width: "210mm", minHeight: "297mm" }}>
      {/* A4 Page Container */}
      <div className="max-w-none mx-auto bg-white" style={{ padding: "20mm" }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b-4 border-blue-700">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">GUARDRISK</h1>
            <p className="text-gray-500 text-sm">Insurance Solutions</p>
          </div>
          <div className="text-right flex-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">QUOTATION</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Quote #:</span>{" "}
                {data.quoteNumber}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {data.quoteDate}
              </p>
              <p>
                <span className="font-semibold">Valid Until:</span>{" "}
                {data.validUntil}
              </p>
            </div>
          </div>
        </div>

        {/* Quote Validity Notice */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">Quote Validity</h3>
          <p className="text-yellow-800 text-sm">
            This quotation is valid until {data.validUntil}. Terms and
            conditions may change after this date.
          </p>
        </div>

        {/* Company and Client Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
              From:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">{data.company.name}</p>
              <p>{data.company.address}</p>
              <p>{data.company.city}</p>
              <p>Phone: {data.company.phone}</p>
              <p>Email: {data.company.email}</p>
              <p>Web: {data.company.website}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
              To:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">{data.client.name}</p>
              <p>Attn: {data.client.contactPerson}</p>
              <p>{data.client.address}</p>
              <p>{data.client.city}</p>
              <p>Phone: {data.client.phone}</p>
              <p>Email: {data.client.email}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Insurance Coverage Details
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="text-left py-3 px-4 text-sm font-bold">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-bold">
                  Coverage Limit
                </th>
                <th className="text-right py-3 px-4 text-sm font-bold">
                  Annual Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{item.description}</td>
                  <td className="py-3 px-4 text-sm">{item.coverage}</td>
                  <td className="py-3 px-4 text-sm text-right">
                    R
                    {item.premium.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 text-right font-semibold bg-gray-50">
                    Subtotal:
                  </td>
                  <td className="py-2 px-4 text-right font-semibold">
                    R
                    {data.subtotal.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 text-right font-semibold bg-gray-50">
                    VAT (15%):
                  </td>
                  <td className="py-2 px-4 text-right font-semibold">
                    R
                    {data.vat.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="bg-blue-700 text-white">
                  <td className="py-3 px-4 text-right font-bold text-lg">
                    Total:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-lg">
                    R
                    {data.total.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Terms and Conditions
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• This quotation is valid for 30 days from the date of issue.</p>
            <p>
              • Premium access begins immediately upon payment confirmation.
            </p>
            <p>
              • Annual subscription is payable in advance unless otherwise
              agreed.
            </p>
            <p>
              • Refunds are subject to our terms of service and cancellation
              policy.
            </p>
            <p>• Features and pricing may be updated with 30 days notice.</p>
            <p>
              • Technical support is included during business hours
              (Monday-Friday, 8AM-5PM).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Guard Check (Pty) Ltd | Reg No: 2025/123456/07 | VAT No: 4567891011
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This document is confidential and intended solely for the addressee.
          </p>
        </div>
      </div>
    </div>
  );
}
