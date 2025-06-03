import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import SecurityLogsForm from "./SecurityLogsForm";
import SecurityLogsList from "./securityLogsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const getCurrentLocalDateTime = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now - tzOffset).toISOString().slice(0, 16);
};

const initialFormState = {
  security_log_ID: null,
  event_type: "",
  location_: "",
  description_: "",
  action_taken: "",
  time_stamp: getCurrentLocalDateTime(),
  incident_ID: "",
  reporting_guard_ID: "",
};

const SecurityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [guards, setGuards] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("security_logs.read")) {
      fetchLogs();
    } else {
      showAlert("You don't have permission to view security logs.", "danger");
      setLoading(false);
    }

    if (hasPermission("security_logs.create") || hasPermission("security_logs.edit")) {
      fetchIncidents();
      fetchGuards();
    }
  }, []);

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/security_logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
      showAlert("Failed to fetch logs.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      const res = await axiosInstance.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  };

  const fetchGuards = async () => {
    try {
      const res = await axiosInstance.get("/guard_staff");
      setGuards(res.data);
    } catch (err) {
      console.error("Error fetching guards:", err);
    }
  };

  const handleEdit = (log) => {
    if (!hasPermission("security_logs.edit")) {
      return showAlert("You don't have permission to edit logs.", "danger");
    }

    setForm({
      security_log_ID: log.security_log_ID || null,
      event_type: log.event_type || "",
      location_: log.location_ || "",
      description_: log.description_ || "",
      action_taken: log.action_taken || "",
      time_stamp: log.time_stamp ? log.time_stamp.slice(0, 16) : getCurrentLocalDateTime(),
      incident_ID: log.incident_ID || "",
      reporting_guard_ID: log.reporting_guard_ID || "",
    });

    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!hasPermission("security_logs.delete")) {
      return showAlert("You don't have permission to delete logs.", "danger");
    }

    try {
      await axiosInstance.delete(`/security_logs/${id}`);
      fetchLogs();
    } catch (err) {
      console.error("Error deleting log:", err.response?.data || err.message);
      showAlert("Failed to delete log.", "danger");
    }
  };

  const handleModalOpen = () => {
    if (!hasPermission("security_logs.create")) {
      return showAlert("You don't have permission to create logs.", "danger");
    }

    setForm({
      ...initialFormState,
      time_stamp: getCurrentLocalDateTime(),
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setForm({
      ...initialFormState,
      time_stamp: getCurrentLocalDateTime(),
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "reporting_guard_ID" || name === "incident_ID"
        ? Number(value) || ""
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && !hasPermission("security_logs.edit")) {
      return showAlert("You don't have permission to edit logs.", "danger");
    }
    if (!isEditing && !hasPermission("security_logs.create")) {
      return showAlert("You don't have permission to create logs.", "danger");
    }

    try {
      const payload = {
        ...form,
        incident_ID: form.incident_ID ? Number(form.incident_ID) : null,
        reporting_guard_ID: form.reporting_guard_ID ? Number(form.reporting_guard_ID) : null,
      };

      if (isEditing) {
        if (!form.security_log_ID) {
          showAlert("No log ID found for editing.", "danger");
          return;
        }
        await axiosInstance.put(`/security_logs/${form.security_log_ID}`, payload);
      } else {
        await axiosInstance.post("/security_logs", payload);
      }

      setForm({
        ...initialFormState,
        time_stamp: getCurrentLocalDateTime(),
      });
      setIsEditing(false);
      setShowModal(false);
      fetchLogs();
    } catch (err) {
      console.error("Error saving log:", err.response?.data || err.message);
      showAlert("Failed to save log. Please try again.", "danger");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Security Logs Management</h2>

      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showModal ? (
        <SecurityLogsForm
          form={form}
          incidents={incidents}
          guards={guards}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onCancel={handleModalClose}
          setForm={setForm}
        />
      ) : hasPermission("security_logs.read") ? (
        <SecurityLogsList
          logs={logs}
          guards={guards}
          incidents={incidents}
          onDelete={handleDelete}
          onEdit={handleEdit}
          goToCreate={handleModalOpen}
        />
      ) : (
        <p>You do not have permission to view security logs.</p>
      )}
    </div>
  );
};

export default SecurityLogsPage;
