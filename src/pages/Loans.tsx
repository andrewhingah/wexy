import React, { useState, useEffect } from "react";
import api from "../api";
import LoanForm from "../components/LoanForm";
import LoanTable from "../components/LoanTable";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
}
interface Loan {
  id: string;
  customer: Customer;
  amount: number;
  issueDate: string;
  interestRate: number;
  interest: number;
  interestCapped: number;
  interestOverflow: number;
  status: "PAID" | "UNPAID";
}

const DAILY_RATE = 0.7143 / 100;

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PAID" | "UNPAID">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/loans");
      setLoans(data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const markAsPaid = async (id: string) => {
    try {
      await api.patch(`/loans/${id}/mark-paid`);
      fetchLoans();
    } catch (error) {
      console.error("Error marking loan as paid:", error);
      alert("Failed to mark loan as paid.");
    }
  };

  const filteredLoans = loans.filter((loan) => {
    const matchesName = loan.customer.firstName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" ? true : loan.status === filterStatus;
    return matchesName && matchesStatus;
  });

  // Calculate totals
  const totalAmount = filteredLoans.reduce((sum, loan) => sum + loan.amount, 0);

  const totalRepayment = filteredLoans.reduce((sum, loan) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(loan.issueDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const interest = loan.interestCapped;
    return sum + loan.amount + interest;
  }, 0);


  const customers = Array.from(new Set(loans.map((l) => l.customer.firstName)));

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Loan Tracker</h1>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading loans...</div>
      ) : (
        <>
          <div className="sticky top-0 z-40 bg-white border-b">
            <LoanForm customers={customers} refreshLoans={fetchLoans} />

            {/* Filters */}
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search by customer name"
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

            {/* Totals summary */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4 border">
              <div>
                <p className="text-gray-600 font-medium">Total Amount Lent</p>
                <p className="text-2xl font-semibold text-blue-700">
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Total Overflow Interest</p>
                <p className="text-2xl font-semibold text-yellow-700">
                  {filteredLoans.reduce((sum, loan) => sum + loan.interestOverflow, 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Total Expected Repayment</p>
                <p className="text-2xl font-semibold text-green-700">
                  {totalRepayment.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
          <LoanTable
            loans={filteredLoans.map(loan => ({
              ...loan,
              customer: {
                id: loan.customer.id,
                name: `${loan.customer.firstName} ${loan.customer.lastName}`,
              },
            }))}
            markAsPaid={markAsPaid}
            dailyRate={DAILY_RATE}
          />
        </>
      )}
    </div>
  );
}
