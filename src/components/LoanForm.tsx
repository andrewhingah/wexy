import { useState } from "react";
import api from "../api";

interface Props {
  customers: string[];
  refreshLoans: () => void;
}

export default function LoanForm({ customers, refreshLoans }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const handleAddLoan = async () => {
    if (!customerName || !amount || !issueDate)
      return alert("Please fill all fields");

    try {
      const payload = {
        customerName,
        amount: parseFloat(amount),
        issueDate,
      };
      await api.post("/loans", payload);
      setCustomerName("");
      setAmount("");
      setIssueDate("");
      refreshLoans();
    } catch (error) {
      console.error("Error adding loan:", error);
      alert("Failed to add loan.");
    }
  };

  return (
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
  );
}
