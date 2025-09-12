export default function GuardriskQuoteTemplate({ quoteData }) {
  // Generate unique quote reference
  const generateQuoteRef = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `GC-${year}${month}-${random}`;
  };

  // Default data structure for GuardCheck subscription
  const data = quoteData || {
    quoteNumber: generateQuoteRef(),
    quoteDate: new Date().toLocaleDateString("en-ZA"),
    validUntil: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-ZA"),
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
        description: "GuardCheck - Yearly Subscription",
        coverage: "Annual Access",
        premium: 2850.0,
        quantity: 1,
      },
    ],
    subtotal: 2850.0,
    vat: 0.0, // Assuming no VAT for subscription service
    total: 2850.0,
    banking: {
      bank: "Nedbank",
      accountNumber: "13118342535",
      accountType: "Current Account",
    },
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
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              GUARDCHECK
            </h1>
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
            </div>
          </div>
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
            Subscription Details
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="text-left py-3 px-4 text-sm font-bold">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-bold">
                  Coverage Period
                </th>
                <th className="text-right py-3 px-4 text-sm font-bold">
                  Amount
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
                <tr className="bg-blue-700 text-white">
                  <td className="py-3 px-4 text-right font-bold text-lg">
                    Total Amount:
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

        {/* Banking Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Banking Details
          </h3>
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <div className="text-sm text-gray-800 space-y-2">
              <p>
                <span className="font-semibold">Bank:</span> {data.banking.bank}
              </p>
              <p>
                <span className="font-semibold">Account Number:</span>{" "}
                {data.banking.accountNumber}
              </p>
              <p>
                <span className="font-semibold">Account Type:</span>{" "}
                {data.banking.accountType}
              </p>
              <p>
                <span className="font-semibold">Reference:</span>{" "}
                {data.quoteNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Notice */}
        <div className="mb-8">
          <div className="bg-green-50 border border-green-300 rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2">
              Payment Instructions
            </h3>
            <p className="text-green-800 text-sm">
              Payment can be made via EFT into our bank account. Once the funds
              have cleared, your account will be activated.
            </p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Terms and Conditions
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              • Subscription access begins immediately upon payment
              confirmation.
            </p>
            <p>• Annual subscription is payable in advance.</p>
            <p>
              • Refunds are subject to our terms of service and cancellation
              policy.
            </p>
            <p>• Features and pricing may be updated with 30 days notice.</p>
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
