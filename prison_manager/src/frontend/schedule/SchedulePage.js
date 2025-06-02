import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import StaffScheduleForm from "./ScheduleForm";
import StaffSchedulesList from "./ScheduleList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const StaffSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userID: "",
    shift_type: "",
    shift_start: "",
    shift_end: "",
    date_: "",
    staff_schedule_ID: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("staff_schedule.read")) {
      fetchSchedules();
      fetchRoles();
      fetchUsers();
    } else {
      showAlert("You don't have permission to view staff schedules.", "danger");
      setLoading(false);
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/staff_schedule");
      setSchedules(res.data);
    } catch (err) {
      console.error("Error fetching schedules:", err.response?.data || err.message);
      showAlert("Error fetching staff schedules.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get("/roles");
      console.log("Roles data:", res.data);
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err.response?.data || err.message);
      showAlert("Error fetching roles.", "danger");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      console.log("Users data:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      showAlert("Error fetching users.", "danger");
    }
  };

  const resetForm = () => {
    setForm({
      userID: "",
      shift_type: "",
      shift_start: "",
      shift_end: "",
      date_: "",
      staff_schedule_ID: null,
    });
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    resetForm();
    fetchSchedules();
  };

  const handleFormCancel = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (schedule) => {
    if (!hasPermission("staff_schedule.edit")) {
      return showAlert("You don't have permission to edit staff schedules.", "danger");
    }

    setForm({
      userID: schedule.userID,
      shift_type: schedule.shift_type,
      shift_start: schedule.shift_start,
      shift_end: schedule.shift_end,
      date_: schedule.date_?.split("T")[0] || "",
      staff_schedule_ID: schedule.staff_schedule_ID,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("staff_schedule.delete")) {
      return showAlert("You don't have permission to delete staff schedules.", "danger");
    }

    try {
      await axiosInstance.delete(`/staff_schedule/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Error deleting schedule:", err.response?.data || err.message);
      showAlert("Failed to delete staff schedule.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("staff_schedule.create")) {
      return showAlert("You don't have permission to create staff schedules.", "danger");
    }
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Staff Schedule Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <StaffScheduleForm
          editingSchedule={isEditing ? form : null}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          users={users}
        />
      ) : hasPermission("staff_schedule.read") ? (
        <StaffSchedulesList
          schedules={schedules}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
          users={users}
          roles={roles}
        />
      ) : (
        <p>You do not have permission to view staff schedules.</p>
      )}
    </div>
  );
};

export default StaffSchedulePage;
