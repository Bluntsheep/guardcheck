export default function GuardriskInvoiceTemplate({ invoiceData }) {
  // Default data structure - replace with your actual props
  const data = invoiceData || {
    invoiceNumber: "INV-2025-001",
    invoiceDate: "2025-01-15",
    dueDate: "2025-02-14",
    policyNumber: "POL-2025-001",
    status: "pending", // pending, paid, overdue
    company: {
      name: "Guardrisk Insurance Company",
      address: "123 Business Street",
      city: "Cape Town, 8001",
      phone: "+27 21 123 4567",
      email: "accounts@guardrisk.co.za",
      website: "www.guardrisk.co.za",
      vatNumber: "4120116074",
      bankDetails: {
        bank: "Standard Bank",
        branch: "Thibault Square",
        branchCode: "020909",
        accountNumber: "123456789",
        accountType: "Current",
      },
    },
    client: {
      name: "ABC Construction Ltd",
      contactPerson: "John Smith",
      address: "456 Industrial Ave",
      city: "Johannesburg, 2001",
      phone: "+27 11 987 6543",
      email: "john@abcconstruction.co.za",
      vatNumber: "4567891234",
    },
    items: [
      {
        id: 1,
        description: "Public Liability Insurance Premium",
        period: "12 months",
        unitPrice: 15000.0,
        quantity: 1,
      },
      {
        id: 2,
        description: "Professional Indemnity Insurance Premium",
        period: "12 months",
        unitPrice: 8500.0,
        quantity: 1,
      },
      {
        id: 3,
        description: "Contractor's All Risk Insurance Premium",
        period: "12 months",
        unitPrice: 12000.0,
        quantity: 1,
      },
    ],
    subtotal: 35500.0,
    vat: 5325.0,
    total: 40825.0,
    amountPaid: 0.0,
    amountDue: 40825.0,
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      paid: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
      overdue: "bg-red-500 text-white",
    };
    return statusStyles[status] || statusStyles.pending;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      paid: "PAID",
      pending: "PENDING",
      overdue: "OVERDUE",
    };
    return statusTexts[status] || "PENDING";
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
            <div className="flex items-center justify-end gap-4 mb-3">
              <h2 className="text-2xl font-bold text-blue-700">INVOICE</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                  data.status
                )}`}>
                {getStatusText(data.status)}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Invoice #:</span>{" "}
                {data.invoiceNumber}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {data.invoiceDate}
              </p>
              <p>
                <span className="font-semibold">Due Date:</span> {data.dueDate}
              </p>
              <p>
                <span className="font-semibold">Policy #:</span>{" "}
                {data.policyNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-blue-800 mb-2">Payment Information</h3>
          <p className="text-blue-800 text-sm">
            Payment is due within 30 days of invoice date. Late payments may
            incur additional charges.
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
              <p>VAT No: {data.company.vatNumber}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
              Bill To:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">{data.client.name}</p>
              <p>Attn: {data.client.contactPerson}</p>
              <p>{data.client.address}</p>
              <p>{data.client.city}</p>
              <p>Phone: {data.client.phone}</p>
              <p>Email: {data.client.email}</p>
              <p>VAT No: {data.client.vatNumber}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Invoice Items
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="text-left py-3 px-4 text-sm font-bold">
                  Description
                </th>
                <th className="text-center py-3 px-4 text-sm font-bold">
                  Period
                </th>
                <th className="text-center py-3 px-4 text-sm font-bold">Qty</th>
                <th className="text-right py-3 px-4 text-sm font-bold">
                  Unit Price
                </th>
                <th className="text-right py-3 px-4 text-sm font-bold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{item.description}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    {item.period}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    R
                    {item.unitPrice.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    R
                    {(item.unitPrice * item.quantity).toLocaleString("en-ZA", {
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
                <tr className="border-b-2 border-gray-300">
                  <td className="py-2 px-4 text-right font-bold bg-gray-100">
                    Total:
                  </td>
                  <td className="py-2 px-4 text-right font-bold">
                    R
                    {data.total.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 text-right font-semibold bg-gray-50">
                    Amount Paid:
                  </td>
                  <td className="py-2 px-4 text-right font-semibold text-green-600">
                    R
                    {data.amountPaid.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="bg-blue-700 text-white">
                  <td className="py-3 px-4 text-right font-bold text-lg">
                    Amount Due:
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-lg">
                    R
                    {data.amountDue.toLocaleString("en-ZA", {
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-semibold">Bank:</span>{" "}
                  {data.company.bankDetails.bank}
                </p>
                <p>
                  <span className="font-semibold">Branch:</span>{" "}
                  {data.company.bankDetails.branch}
                </p>
                <p>
                  <span className="font-semibold">Branch Code:</span>{" "}
                  {data.company.bankDetails.branchCode}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Account Number:</span>{" "}
                  {data.company.bankDetails.accountNumber}
                </p>
                <p>
                  <span className="font-semibold">Account Type:</span>{" "}
                  {data.company.bankDetails.accountType}
                </p>
                <p>
                  <span className="font-semibold">Reference:</span>{" "}
                  {data.invoiceNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Payment Terms
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Payment is due within 30 days of invoice date.</p>
            <p>• Please use the invoice number as payment reference.</p>
            <p>• Premium access will be activated upon payment confirmation.</p>
            <p>
              • Service will be suspended if payment is not received by due
              date.
            </p>
            <p>
              • All disputes must be raised within 7 days of receipt of this
              invoice.
            </p>
            <p>• Cancellation must be requested 30 days before renewal date.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Guard Check (Pty) Ltd | Reg No: 2025/123456/07 | VAT No:{" "}
            {data.company.vatNumber}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Thank you for your business. For queries, contact{" "}
            {data.company.email}
          </p>
        </div>
      </div>
    </div>
  );
}
