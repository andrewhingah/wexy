import React, { useState, useEffect } from "react";

interface Loan {
  id: string;
  customerName: string;
  amount: number;
  issueDate: string;
  status: "PAID" | "UNPAID";
}

const DAILY_RATE = 0.7143 / 100;

function App() {
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem("loans");
    return saved ? JSON.parse(saved) : [];
  });

  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PAID" | "UNPAID">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("loans", JSON.stringify(loans));
  }, [loans]);

  const handleAddLoan = () => {
    if (!customerName || !amount || !issueDate) return alert("Fill all fields");
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      customerName,
      amount: parseFloat(amount),
      issueDate,
      status: "UNPAID",
    };
    setLoans((prev) => [...prev, newLoan]);
    setCustomerName("");
    setAmount("");
    setIssueDate("");
  };

  const markAsPaid = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: "PAID" } : loan
      )
    );
  };

  const calcDays = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const calcInterest = (amount: number, days: number) => amount * DAILY_RATE * days;

  const filteredLoans = loans.filter((loan) => {
    const matchesName = loan.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" ? true : loan.status === filterStatus;
    return matchesName && matchesStatus;
  });

  const customers = Array.from(new Set(loans.map((l) => l.customerName)));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Shylock Loan Tracker
        </h1>

        {/* Loan Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <input
            list="customers"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            className="border p-2 rounded-lg"
          />
          <datalist id="customers">
            {customers.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 rounded-lg"
          />
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <button
            onClick={handleAddLoan}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2"
          >
            Add Loan
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by customer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-2 w-1/2"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border rounded-lg p-2"
          >
            <option value="ALL">All</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        {/* Loans List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Days</th>
                <th className="p-2 border">Interest</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No loans found
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const days = calcDays(loan.issueDate);
                  const interest = calcInterest(loan.amount, days);
                  const total = loan.amount + interest;
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{loan.customerName}</td>
                      <td className="p-2 border">{loan.amount.toFixed(2)}</td>
                      <td className="p-2 border text-center">{days}</td>
                      <td className="p-2 border">{interest.toFixed(2)}</td>
                      <td className="p-2 border">{total.toFixed(2)}</td>
                      <td
                        className={`p-2 border font-semibold ${
                          loan.status === "PAID"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {loan.status}
                      </td>
                      <td className="p-2 border text-center">
                        {loan.status === "UNPAID" && (
                          <button
                            onClick={() => markAsPaid(loan.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
