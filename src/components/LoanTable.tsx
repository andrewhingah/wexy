interface Customer {
  id: string;
  name: string;
}
interface Loan {
  id: string;
  customer: Customer;
  amount: number;
  issueDate: string;
  status: "PAID" | "UNPAID";
}

interface Props {
  loans: Loan[];
  markAsPaid: (id: string) => void;
  dailyRate: number;
}

export default function LoanTable({ loans, markAsPaid, dailyRate }: Props) {
  const calcDays = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const calcInterest = (amount: number, days: number) =>
    amount * dailyRate * days;

  return (
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
          {loans.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                No loans found
              </td>
            </tr>
          ) : (
            loans.map((loan) => {
              const days = calcDays(loan.issueDate);
              const interest = calcInterest(loan.amount, days);
              const total = loan.amount + interest;
              return (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{loan.customer.name}</td>
                  <td className="p-2 border">
                    {loan.amount.toLocaleString()}
                  </td>
                  <td className="p-2 border text-center">{days}</td>
                  <td className="p-2 border">
                    {interest.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-2 border">
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
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
  );
}
