import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center mt-12">
      <h1 className="text-3xl font-semibold mb-6">Welcome to Shylock Loan Tracker</h1>
      <Link
        to="/loans"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        View & Manage Loans
      </Link>
    </div>
  );
}

