import React, { useEffect, useState } from "react";
import axios from "axios";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ year: "",allocated_funds: "",used_funds: "", remaining_funds: "", last_updated: "",id: null,});
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/budgets");
      setBudgets(res.data);
    } catch (err) {
      console.error("Error fetching budgets:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const remaining = parseFloat(form.allocated_funds) - parseFloat(form.used_funds);

      const bdg = {
        year: parseInt(form.year),
        allocated_funds: parseFloat(form.allocated_funds),
        used_funds: parseFloat(form.used_funds),
        remaining_funds: remaining,
        last_updated: form.last_updated,
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/budgets/${form.id}`, bdg);
      } else {
        await axios.post("http://localhost:5000/api/budgets", bdg);
      }

      resetForm();
      fetchBudgets();
    } catch (err) {
      console.error("Error saving budget:", err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setForm({ year: "", allocated_funds: "", used_funds: "",remaining_funds: "", last_updated: "",id: null,  });
    setIsEditing(false);
    setShowForm(false);
  };

  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const handleEdit = (budget) => {
    setForm({  year: budget.year_,allocated_funds: budget.allocated_funds,used_funds: budget.used_funds,
      remaining_funds: budget.remaining_funds,last_updated: formatDateForInput(budget.last_updated),id: budget.budget_ID, });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(`http://localhost:5000/api/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        console.error("Error deleting budget:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = () => setShowForm(false);

  return (
    <div className="container mt-4">
      <BudgetForm
        showModal={showForm}
        handleClose={handleClose}
        form={form}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <BudgetList
        budgets={budgets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default BudgetPage;
