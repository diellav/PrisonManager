import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const BudgetForm = ({ editingBudget, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    year: "",
    allocated_funds: "",
    used_funds: "",
    last_updated: "",
    description_: "",
  });

  const [error, setError] = useState("");

 useEffect(() => {
  if (editingBudget) {
    setForm({
      description_: editingBudget.description_ || "",
      year_: editingBudget.year_ !== undefined && editingBudget.year_ !== null
        ? editingBudget.year_.toString()
        : "",
      allocated_funds: editingBudget.allocated_funds?.toString() || "",
      used_funds: editingBudget.used_funds?.toString() || "",
      last_updated: editingBudget.last_updated
        ? editingBudget.last_updated.substring(0, 10)
        : "",
    });
  }
}, [editingBudget]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const remaining_funds =
      parseFloat(form.allocated_funds) - parseFloat(form.used_funds);

    const budgetData = {
      year_: parseInt(form.year_),
      allocated_funds: parseFloat(form.allocated_funds),
      used_funds: parseFloat(form.used_funds),
      remaining_funds,
      last_updated: form.last_updated,
      description_: form.description_,
    };

    try {
      if (editingBudget && editingBudget.budget_ID) {
        await axiosInstance.put(`/budgets/${editingBudget.budget_ID}`, budgetData);
      } else {
        await axiosInstance.post("/budgets", budgetData);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving budget:", err);
      setError("Failed to save budget.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingBudget ? "Edit Budget" : "Create Budget"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Description</label>
              <input
                type="text"
                name="description_"
                className="form-control"
                value={form.description_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Year</label>
              <input
                type="number"
                name="year_"
                className="form-control"
                value={form.year_}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Allocated Funds</label>
              <input
                type="number"
                name="allocated_funds"
                className="form-control"
                value={form.allocated_funds}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Used Funds</label>
              <input
                type="number"
                name="used_funds"
                className="form-control"
                value={form.used_funds}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Last Updated</label>
              <input
                type="date"
                name="last_updated"
                className="form-control"
                value={form.last_updated}
                onChange={handleChange}
                required
              />
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
              {editingBudget ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
