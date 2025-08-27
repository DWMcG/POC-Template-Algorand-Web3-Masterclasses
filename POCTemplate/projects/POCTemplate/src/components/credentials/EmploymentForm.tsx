// src/components/credentials/EmploymentForm.tsx
import React, { useState } from "react";

export interface EmploymentFormData {
  employee_name: string;
  employee_id: string;
  employee_wallet: string;
  employer_name: string;
  role: string;
  start_date: string;
  end_date?: string;
  reference_id?: string;
  credential_proof?: string;
  notes?: string;
  version?: string;
  image?: string;
}

export interface EmploymentFormProps {
  onSubmit: (
    credential: EmploymentFormData & {
      credential_id: string;
      type: string;
      status: string;
      issue_date: string;
    }
  ) => void;
}

const EmploymentForm: React.FC<EmploymentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EmploymentFormData>({
    employee_name: "",
    employee_id: "",
    employee_wallet: "",
    employer_name: "",
    role: "",
    start_date: "",
    end_date: "",
    reference_id: "",
    credential_proof: "",
    notes: "",
    version: "1.1",
    image: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Generate credential ID
    const credential_id = `EMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const credential = {
      credential_id,
      type: "employment",
      ...formData,
      end_date: formData.end_date || undefined,
      status: formData.end_date ? "closed" : "open",
      issue_date: new Date().toISOString().split("T")[0],
    };

    // Pass credential back to Home.tsx
    onSubmit(credential);
  };

  return (
    <form className="flex flex-col gap-3 p-4 border rounded-md shadow-md">
      <input
        type="text"
        name="employee_name"
        placeholder="Employee Name"
        value={formData.employee_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="employee_id"
        placeholder="Employee ID"
        value={formData.employee_id}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="employee_wallet"
        placeholder="Employee Wallet"
        value={formData.employee_wallet}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="employer_name"
        placeholder="Employer Name"
        value={formData.employer_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
      />
      <input
        type="text"
        name="reference_id"
        placeholder="Reference ID (optional)"
        value={formData.reference_id}
        onChange={handleChange}
      />
      <input
        type="text"
        name="credential_proof"
        placeholder="Credential Proof URL (optional)"
        value={formData.credential_proof}
        onChange={handleChange}
      />
      <input
        type="text"
        name="notes"
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={handleChange}
      />
      <input
        type="text"
        name="image"
        placeholder="Image IPFS URL (optional)"
        value={formData.image}
        onChange={handleChange}
      />

      <button
        type="button"              // <-- Changed from "submit"
        onClick={handleSubmit}      // <-- Added this line
        className="px-4 py-2 bg-primary text-white rounded-md"
        style={{ backgroundColor: "#1C2D5A" }}
      >
        issue employment credential
      </button>

      {/* Version display below the button */}
      <div className="text-sm text-gray-500 mt-2 text-center">
        Version: {formData.version}
      </div>
    </form>
  );
};

export default EmploymentForm;
