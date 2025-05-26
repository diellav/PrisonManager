 import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const SalaryForm = ({ editingSalary, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    staff_ID: "",
    amount: "",
    payment_date: "",
    payment_method: "",
    notes: "",
    budget_ID: "",
  });
  const [users, setUsers] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (editingSalary) {
      setForm({
        staff_ID: editingSalary.staff_ID || "",
        amount: editingSalary.amount || "",
        payment_date:  editingSalary.payment_date.split("T")[0] || "",
        payment_method: editingSalary.payment_method || "",
        notes: editingSalary.notes || "",
        budget_ID: editingSalary.budget_ID || "",
      });
    }
  }, [editingSalary]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
      setUsers([]);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await axiosInstance.get("/budgets");
      setBudgets(res.data);
    } catch (err) {
      console.error("Error fetching budgets", err);
      setBudgets([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedUser = users.find(
      (user) => user.userID === parseInt(form.staff_ID)
    );
    if (!selectedUser) {
      setError("User ID not found in the system.");
      return;
    }

    const selectedBudget = budgets.find(
      (b) => b.budget_ID === parseInt(form.budget_ID)
    );
    if (!selectedBudget) {
      setError("Selected budget does not exist.");
      return;
    }

    try {
      if (editingSalary) {
        await axiosInstance.put(`/staff_salaries/${editingSalary.salary_ID}`, form);
      } else {
        await axiosInstance.post("/staff_salaries", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving salary:", err);
      if (err.response && err.response.data && err.response.data.error) {
      setError(err.response.data.error);
    } else {
      setError("Failed to save salary.");
    }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingSalary ? "Edit Salary" : "Create Salary"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">User</label>
              <select
                name="staff_ID"
                value={form.staff_ID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.userID} value={user.userID}>
                    {user.first_name} {user.last_name} (ID: {user.userID})
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="form-control"
                required
                min="0"
                step="0.01"
              />
            </div>

            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Payment Date and Time</label>
              <input
                type="date"
                name="payment_date"
                value={form.payment_date ? form.payment_date.split("T")[0] : ""}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Payment Method</label>
              <input
                type="text"
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {}
            <div className="col-md-12 mb-3">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Budget</label>
              <select
                name="budget_ID"
                value={form.budget_ID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Budget --</option>
                {budgets.map((budget) => (
                  <option key={budget.budget_ID} value={budget.budget_ID}>
                    {budget.year_} - {budget.description_} ,remaining: {budget.remaining_funds}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSalary ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryForm;