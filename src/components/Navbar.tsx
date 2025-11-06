import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex gap-6">
      <Link to="/" className="hover:text-blue-400">Home</Link>
      <Link to="/loans" className="hover:text-blue-400">Loans</Link>
      <Link to="/add-customer" className="hover:text-blue-400">Add Customer</Link>
      <Link to="/add-loan" className="hover:text-blue-400">Add Loan</Link>
    </nav>
  );
}

