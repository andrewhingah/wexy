import React, { useState } from "react";

export enum SourceOfIncome {
  EMPLOYMENT = "EMPLOYMENT",
  BUSINESS = "BUSINESS",
  INVESTMENTS = "INVESTMENTS",
  OTHER = "OTHER",
}

const AddCustomer: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    sourceOfIncome: "",
  });

  const [proofOfResidence, setProofOfResidence] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfIncome, setProofOfIncome] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.idNumber || !form.sourceOfIncome) {
      return alert("Please fill all mandatory fields.");
    }

    if (!proofOfResidence || !idDocument || !proofOfIncome) {
      return alert("Please upload all required documents.");
    }

    const formData = new FormData();
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("idNumber", form.idNumber);
    formData.append("sourceOfIncome", form.sourceOfIncome);
    formData.append("proofOfResidence", proofOfResidence);
    formData.append("idDocument", idDocument);
    formData.append("proofOfIncome", proofOfIncome);

    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/customers`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add customer");
      alert("Customer added successfully!");
      setForm({ firstName: "", lastName: "", idNumber: "", sourceOfIncome: "" });
      setProofOfResidence(null);
      setIdDocument(null);
      setProofOfIncome(null);
    } catch (err) {
      console.error(err);
      alert("Error adding customer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Add New Customer
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded-lg"
              required
            />
          </div>

          <input
            type="text"
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            placeholder="ID Number"
            className="border p-2 rounded-lg"
            required
          />

          <select
            name="sourceOfIncome"
            value={form.sourceOfIncome}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          >
            <option value="">Select Source of Income</option>
            {Object.values(SourceOfIncome).map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          <label className="block">
            <span className="text-gray-700 font-medium">Proof of Residence</span>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setProofOfResidence)}
              className="mt-1 block w-full border p-2 rounded-lg"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">ID Document</span>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setIdDocument)}
              className="mt-1 block w-full border p-2 rounded-lg"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Proof of Income</span>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setProofOfIncome)}
              className="mt-1 block w-full border p-2 rounded-lg"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-2 mt-4"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
