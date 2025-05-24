import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import JudgeForm from "./judgeForm";
import JudgesList from "./judgeList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const JudgePage = () => {
  const [judges, setJudges] = useState([]);
  const [form, setForm] = useState({
    judge_ID: null,
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone: "",
    email: "",
    rank_: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("judges.read")) {
      fetchJudges();
    }
  }, []);

  const fetchJudges = async () => {
    try {
      const res = await axiosInstance.get("/judges");
      setJudges(res.data);
    } catch (err) {
      console.error("Error fetching judges:", err.response?.data || err.message);
    }
  };

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing && hasPermission("judges.edit")) {
        await axiosInstance.put(`/judges/${form.judge_ID}`, form);
      } else if (!isEditing && hasPermission("judges.create")) {
        await axiosInstance.post("/judges", form);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }

      setShowForm(false);
      fetchJudges();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        showAlert("Access denied: You do not have permission.", "danger");
      } else if (
        error.response?.status === 500 &&
        error.response.data?.includes("duplicate key")
      ) {
        showAlert("Email already exists.", "danger");
      } else {
        showAlert("Failed to save judge. Please try again.", "danger");
      }
      console.error("Failed to save judge:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (judge) => {
    if (!hasPermission("judges.edit")) {
      alert("No permission to edit judges.");
      return;
    }

    try {
      const res = await axiosInstance.get(`/judges/${judge.judge_ID}`);
      const data = res.data;

      const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      };

      setForm({
        judge_ID: data.judge_ID,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        date_of_birth: formatDate(data.date_of_birth),
        phone: data.phone || "",
        email: data.email || "",
        rank_: data.rank_ || data.rank || "",
      });

      setIsEditing(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("Failed to fetch judge details.");
      console.error("Error fetching judge:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("judges.delete")) return showAlert("No permission to delete judges.", "danger");

    if (window.confirm("Are you sure you want to delete this judge?")) {
      try {
        await axiosInstance.delete(`/judges/${id}`);
        fetchJudges();
      } catch (err) {
        showAlert("Failed to delete judge.", "danger");
        console.error("Error deleting judge:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("judges.create")) return showAlert("No permission to create judges.", "danger");
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      judge_ID: null,
      first_name: "",
      last_name: "",
      date_of_birth: "",
      phone: "",
      email: "",
      rank_: "",
      court_name: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Judges Management</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {showForm && (
        <JudgeForm
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          handleClose={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <JudgesList
          judges={judges}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />
      )}
    </div>
  );
};

export default JudgePage;
