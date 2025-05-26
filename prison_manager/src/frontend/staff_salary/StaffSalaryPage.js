import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import SalaryForm from "./StaffSalaryForm";
import StaffSalariesList from "./StaffSalaryList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const SalaryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [staffList, setStaffList] = useState([]);  
  const [editingSalary, setEditingSalary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [budgets, setBudgets] = useState([]);
  

const fetchBudgets = async () => {
  try {
    const res = await axiosInstance.get("/budgets");
    setBudgets(res.data);
  } catch (err) {
    console.error("Failed to fetch budgets", err);
  }
};
  useEffect(() => {
    if (hasPermission("staff_salaries.read")) {
        fetchBudgets();
      fetchSalaries();
      fetchStaffList(); 
    } else {
      setLoading(false);
      setError("You do not have permission to view salaries.");
    }
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/staff_salaries");
      setSalaries(res.data);
    } catch (err) {
      console.error("Error fetching salaries:", err);
      setError("Error fetching salaries.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await axiosInstance.get("/users"); 
      setStaffList(res.data);
    } catch (err) {
      console.error("Error fetching staff list:", err);
      setStaffList([]);
    }
  };

  const goToCreate = () => {
    if (!hasPermission("staff_salaries.create")) return;
    setEditingSalary(null);
    setShowForm(true);
  };

  const onEdit = (salary) => {
    if (!hasPermission("staff_salaries.edit")) return;
    setEditingSalary(salary);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!hasPermission("staff_salaries.delete")) return;

    try {
      await axiosInstance.delete(`/staff_salaries/${id}`);
      setSalaries((prev) => prev.filter((s) => s.salary_ID !== id));
    } catch (err) {
      console.error("Error deleting salary:", err);
      setError("Failed to delete salary.");
    }
  };

  const onSuccess = () => {
    setShowForm(false);
    fetchSalaries();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2>Staff Salaries Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm && (hasPermission("staff_salaries.create") || hasPermission("staff_salaries.edit")) ? (
        <SalaryForm
          editingSalary={editingSalary}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      ) : hasPermission("staff_salaries.read") ? (
        <StaffSalariesList
          salaries={salaries}
          staffList={staffList}
          onEdit={onEdit}       
          onDelete={onDelete}
          goToCreate={goToCreate}
           budgets={budgets}  
        />
      ) : null}
    </div>
  );
};

export default SalaryPage;
