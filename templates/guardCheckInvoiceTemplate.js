export default function GuardriskInvoiceTemplate({ invoiceData }) {
  // Generate unique invoice reference
  const generateInvoiceRef = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `INV-${year}${month}-${random}`;
  };

  // Default data structure for GuardCheck subscription invoice
  const data = invoiceData || {
    invoiceNumber: generateInvoiceRef(),
    invoiceDate: new Date().toLocaleDateString("en-ZA"),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-ZA"
    ),
    paymentDate: new Date().toLocaleDateString("en-ZA"),
    status: "paid",
    quoteReference: "GC-202509-1234", // Reference to original quote
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
        coverage: "Annual Access (12 months)",
        subscriptionStart: new Date().toLocaleDateString("en-ZA"),
        subscriptionEnd: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-ZA"),
        premium: 2850.0,
        quantity: 1,
      },
    ],
    subtotal: 2850.0,
    vat: 0.0, // Assuming no VAT for subscription service
    total: 2850.0,
    paymentMethod: "EFT",
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
        <div className="flex justify-between items-center mb-8 pb-6 border-b-4 border-green-600">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              GUARDCHECK
            </h1>
          </div>
          <div className="text-right flex-1">
            <h2 className="text-2xl font-bold text-green-600 mb-3">INVOICE</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Invoice #:</span>{" "}
                {data.invoiceNumber}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {data.invoiceDate}
              </p>
              <p>
                <span className="font-semibold">Quote Ref:</span>{" "}
                {data.quoteReference}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Status Banner */}
        <div className="mb-6">
          <div className="bg-green-100 border border-green-400 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <h3 className="font-bold text-green-800 text-lg">
                PAYMENT CONFIRMED
              </h3>
            </div>
            <p className="text-green-700 text-sm">
              Payment received on {data.paymentDate} via {data.paymentMethod}
            </p>
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
              <tr className="bg-green-600 text-white">
                <th className="text-left py-3 px-4 text-sm font-bold">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-bold">
                  Subscription Period
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
                  <td className="py-3 px-4 text-sm">
                    {item.subscriptionStart} - {item.subscriptionEnd}
                  </td>
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
                <tr className="bg-green-600 text-white">
                  <td className="py-3 px-4 text-right font-bold text-lg">
                    Total Paid:
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

        {/* Subscription Activation Notice */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">Account Activation</h3>
            <div className="text-blue-800 text-sm space-y-1">
              <p>
                Your GuardCheck subscription has been activated and is now ready
                for use.
              </p>
              <p>
                <span className="font-semibold">Subscription starts:</span>{" "}
                {data.items[0]?.subscriptionStart}
              </p>
              <p>
                <span className="font-semibold">Subscription expires:</span>{" "}
                {data.items[0]?.subscriptionEnd}
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Terms and Service Information
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              • Subscription is active for 12 months from the start date shown
              above.
            </p>
            <p>• Renewal notices will be sent 30 days before expiration.</p>

            <p>
              • Terms of service and privacy policy are available on our
              website.
            </p>
            <p>
              • This invoice serves as proof of payment and subscription
              activation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
