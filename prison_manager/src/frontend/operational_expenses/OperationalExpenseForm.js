import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const OperationalExpenseForm = ({ editingExpense, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    description_: "",
    amount: "",
    date_: "",
    category: "",
    budget_ID: "",
    approved_by: "",
    asset_ID: "",
  });

  const [error, setError] = useState("");

  
  const [budgets, setBudgets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [roles, setRoles] = useState([]);

  
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [budgetsRes, usersRes, assetsRes,rolesRes] = await Promise.all([
          axiosInstance.get("/budgets"),
          axiosInstance.get("/users"),
          axiosInstance.get("/assets"),
           axiosInstance.get("/roles")
        ]);
        setBudgets(budgetsRes.data);
        setUsers(usersRes.data);
        setAssets(assetsRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        console.error("Failed to fetch lists:", err);
      }
    };
    fetchLists();
  }, []);
const getRoleName = (roleID) => {
  const role = roles.find((r) => r.roleID === roleID);
  return role ? role.name_.toLowerCase() : "";
};
  
  useEffect(() => {
    if (editingExpense) {
      setForm({
        description_: editingExpense.description_ || "",
        amount: editingExpense.amount !== null ? editingExpense.amount.toString() : "",
        date_: editingExpense.date_ ? editingExpense.date_.slice(0, 10) : "",
        category: editingExpense.category || "",
         budget_ID: parseInt(editingExpense.budget_ID) || "",
        approved_by: editingExpense.approved_by !== null ? editingExpense.approved_by.toString() : "",
        asset_ID: editingExpense.asset_ID !== null ? editingExpense.asset_ID.toString() : "",
      });
    } else {
      setForm({
        description_: "",
        amount: "",
        date_: "",
        category: "",
        budget_ID: "",
        approved_by: "",
        asset_ID: "",
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      budget_ID: parseInt(form.budget_ID),
      approved_by: form.approved_by ? parseInt(form.approved_by) : null,
      asset_ID: form.asset_ID ? parseInt(form.asset_ID) : null,
    };

    console.log("Payload being sent:", payload);

    try {
      if (editingExpense) {
        await axiosInstance.put(`/operational_expenses/${editingExpense.operational_expense_ID}`, {
          ...payload,
          operational_expense_ID: editingExpense.operational_expense_ID,
        });
      } else {
        await axiosInstance.post("/operational_expenses", payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving expense:", err);
      setError("Failed to save operational expense.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingExpense ? "Edit Operational Expense" : "Create Operational Expense"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description_"
                value={form.description_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date_"
                value={form.date_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Budget</label>
              <select
                className="form-select"
                name="budget_ID"
                value={form.budget_ID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Budget --</option>
                {budgets.map((budget) => (
                  <option key={budget.budget_ID} value={budget.budget_ID}>
                    {budget.year_} - {budget.description_}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Approved By</label>
              <select
                className="form-select"
                name="approved_by"
                value={form.approved_by}
                onChange={handleChange}
                required
              >
                <option value="">-- Select User --</option>
                {users
                .filter((user) => {
                const roleName = getRoleName(user.roleID);
                return ["warden", "superadmin", "admin", "manager"].some(keyword =>
                  roleName.includes(keyword)
                );
              })
                .map((user) => (
                  <option key={user.userID} value={user.userID}>
                    {user.first_name} {user.last_name} ({getRoleName(user.roleID)})
                  </option>
              ))}
              </select>
            </div>

            {}
            <div className="col-md-6 mb-3">
              <label className="form-label">Asset (optional)</label>
              <select
                className="form-select"
                name="asset_ID"
                value={form.asset_ID}
                onChange={handleChange}
              >
                <option value="">-- Select Asset --</option>
                {assets.map((asset) => (
                  <option key={asset.asset_ID} value={asset.asset_ID}>
                    {`ID: ${asset.asset_ID} - ${asset.name}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingExpense ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperationalExpenseForm;
