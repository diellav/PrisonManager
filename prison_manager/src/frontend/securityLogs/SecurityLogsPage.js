import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import SecurityLogsForm from "./SecurityLogsForm";
import SecurityLogsList from "./securityLogsList";

  function getCurrentLocalDateTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().slice(0, 16);
  }

    function initialFormState() {
    return {
      security_log_ID: null,
      event_type: "",
      location_: "",
      description_: "",
      action_taken: "",
      time_stamp: getCurrentLocalDateTime(),
      incident_ID: "",
      reporting_guard_ID: "",
    };
  }

const SecurityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [guards, setGuards] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");




  useEffect(() => {
    fetchLogs();
    fetchIncidents();
    fetchGuards();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axiosInstance.get("/security_logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err.response?.data || err.message);
    }
  };

  const fetchIncidents = async () => {
    try {
      const res = await axiosInstance.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Error fetching incidents:", err.response?.data || err.message);
    }
  };

  const fetchGuards = async () => {
    try {
      const res = await axiosInstance.get("/guard_staff");
      setGuards(res.data);
    } catch (err) {
      console.error("Error fetching guards:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        (name === "incident_ID" || name === "reporting_guard_ID") && value !== ""
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState());
    setIsEditing(false);
    setShowModal(false);
    setFormError("");
  };

  const handleSubmit = async () => {
    setFormError("");

    try {
      const payload = {
        ...form,
        incident_ID: form.incident_ID ? Number(form.incident_ID) : null,
        reporting_guard_ID: form.reporting_guard_ID ? Number(form.reporting_guard_ID) : null,
      };

      if (isEditing) {
        await axiosInstance.put(`/security_logs/${form.security_log_ID}`, payload);
      } else {
        await axiosInstance.post("/security_logs", payload);
      }

      resetForm();
      fetchLogs();
    } catch (err) {
      console.error("Error saving log:", err.response?.data || err.message);
      if (err.response?.data?.error) {
        setFormError(err.response.data.error);
      } else {
        setFormError("Something went wrong while saving the log.");
      }
    }
  };

const handleEdit = (log) => {

  setForm({
    security_log_ID: log.security_log_ID, 
    event_type: log.event_type || "",
    location_: log.location_ || "",
    description_: log.description_ || "",
    action_taken: log.action_taken || "",
    time_stamp: log.time_stamp?.slice(0, 16) || getCurrentLocalDateTime(),
    incident_ID: log.incident_ID ?? "",
    reporting_guard_ID: log.reporting_guard_ID ?? "",
  });
  setIsEditing(true);
  setShowModal(true);
};



  const handleDelete = async (id) => {
      try {
        await axiosInstance.delete(`/security_logs/${id}`);
        fetchLogs();
      }catch (err) {
        console.error("Error deleting log:", err.response?.data || err.message);
      }
  };

  const handleModalOpen = () => {
    resetForm();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Security Logs Management</h2>
      {showModal ? (
        <SecurityLogsForm
          form={form}
          isEditing={isEditing}
          incidents={incidents}
          guards={guards}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onCancel={handleModalClose}
          error={formError}
        />
      ) : (
        <SecurityLogsList
          logs={logs}
          guards={guards}
          incidents={incidents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
        />
      )}
    </div>
  );
};

export default SecurityLogsPage;
