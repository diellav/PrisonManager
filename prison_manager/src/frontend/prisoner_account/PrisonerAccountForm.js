import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const PrisonerAccountForm = ({ editingAccount, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    prisoner_ID: "",
    balance: "",
    status: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingAccount) {
      setForm({
        prisoner_ID: editingAccount.prisoner_ID || "",
        balance: editingAccount.balance || "",
        status: editingAccount.status || "",
      });
    }
  }, [editingAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        await axiosInstance.put(`/prisoner_accounts/${editingAccount.account_ID}`, form);
      } else {
        await axiosInstance.post("/prisoner_accounts", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving account:", err);
      setError("Failed to save prisoner account.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingAccount ? "Edit Account" : "Create Account"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {["prisoner_ID", "balance", "status"].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <label className="form-label">
                  {field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type={field === "balance" ? "number" : "text"}
                  className="form-control"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAccount ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrisonerAccountForm;
