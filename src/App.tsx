import React, { useState } from "react";

function App() {
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [daysElapsed, setDaysElapsed] = useState<number | null>(null);
  const [interest, setInterest] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const rate = 0.7143 / 100; // 0.7143% per day

  const calculate = () => {
    const principal = parseFloat(amount);
    if (isNaN(principal) || !issueDate) return;

    const issued = new Date(issueDate);
    const today = new Date();

    // Calculate days elapsed (rounded down)
    const diffTime = today.getTime() - issued.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Simple interest
    const interestAmount = principal * rate * diffDays;
    const totalAmount = principal + interestAmount;

    setDaysElapsed(diffDays);
    setInterest(interestAmount);
    setTotal(totalAmount);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Loan Interest Calculator
        </h1>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Loan Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Enter loan amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date Issued</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
          >
            Calculate
          </button>

          {total !== null && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg text-center space-y-1">
              <p className="text-sm text-gray-700">
                Days Elapsed: <span className="font-semibold">{daysElapsed}</span>
              </p>
              <p className="text-sm text-gray-700">
                Interest Earned:{" "}
                <span className="font-semibold text-green-700">
                  {interest?.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Total Amount Due:{" "}
                <span className="font-semibold text-green-700">
                  {total?.toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
