import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import IncidentsForm from "./IncidentsForm";
import IncidentsList from "./IncidentsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [prisoners, setPrisoners] = useState([]);
  const [form, setForm] = useState({
    incidentID: null,
    date_reported: "",
    severity: "",
    resolved: "",
    follow_up_actions: "",
    prisonerIDs: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ message: "", type: "" });

  useEffect(() => {
    const init = async () => {
      if (
        hasPermission("incidents.create") ||
        hasPermission("incidents.edit") ||
        hasPermission("incidents.read")
      ) {
        await fetchPrisoners();
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (prisoners.length > 0 && hasPermission("incidents.read")) {
      fetchIncidents();
    }
  }, [prisoners]);

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Error fetching prisoners:", err.response?.data || err.message);
    }
  };

  const enrichWithPrisonerNames = (incidents, allPrisoners) => {
    return incidents.map((incident) => {
      const enrichedPrisoners = (incident.prisonerIDs || [])
        .map((id) => {
          const prisoner = allPrisoners.find((p) => p.prisonerID === id);
          if (!prisoner) return null;
          return {
            prisonerID: prisoner.prisonerID,
            first_name: prisoner.first_name,
            last_name: prisoner.last_name,
          };
        })
        .filter(Boolean);

      return {
        ...incident,
        prisoners: enrichedPrisoners,
      };
    });
  };

  const fetchIncidents = async () => {
    try {
      const res = await axiosInstance.get("/incidents");
      const mappedIncidents = res.data.map((incident) => ({
        ...incident,
        incidentID: incident.incident_ID,
        prisonerIDs: incident.prisonerIDs || [],
      }));
      const enriched = enrichWithPrisonerNames(mappedIncidents, prisoners);
      setIncidents(enriched);
    } catch (err) {
      console.error("Error fetching incidents:", err.response?.data || err.message);
    }
  };

  const showAlert = (message, type = "warning") => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      date_reported: form.date_reported,
      severity: form.severity,
      resolved: form.resolved,
      follow_up_actions: form.follow_up_actions,
      prisonerIDs: form.prisonerIDs,
    };

    try {
      if (isEditing && hasPermission("incidents.edit")) {
        await axiosInstance.put(`/incidents/${form.incidentID}`, dataToSend);
      } else if (!isEditing && hasPermission("incidents.create")) {
        await axiosInstance.post("/incidents", dataToSend);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }

      setShowForm(false);
      fetchIncidents();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        showAlert("Access denied: You do not have the required permission.", "danger");
      } else {
        showAlert("Failed to save incident. Please try again.", "danger");
      }
      console.error("Failed to save incident:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (incident) => {
    if (!hasPermission("incidents.edit")) {
      return showAlert("No permission to edit incidents.", "danger");
    }

    try {
      const res = await axiosInstance.get(`/incidents/${incident.incident_ID || incident.incidentID}`);
      const incidentData = res.data;

      const formattedDate = incidentData.date_reported?.split("T")[0] || "";

      setForm({
        incidentID: incidentData.incident_ID,
        date_reported: formattedDate,
        severity: incidentData.severity || "",
        resolved: incidentData.resolved || "",
        follow_up_actions: incidentData.follow_up_actions || "",
        prisonerIDs: incidentData.prisonerIDs || [],
      });

      setIsEditing(true);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching incident details:", error.response?.data || error.message);
      if (error.response?.status === 403) {
        showAlert("Access denied: You do not have permission to edit this incident.", "danger");
      } else {
        showAlert("Failed to fetch incident details.", "danger");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("incidents.delete")) {
      return showAlert("No permission to delete incidents.", "danger");
    }

    try {
      await axiosInstance.delete(`/incidents/${id}`);
      fetchIncidents();
    } catch (err) {
      showAlert("Failed to delete incident.", "danger");
      console.error("Error deleting incident:", err.response?.data || err.message);
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("incidents.create")) {
      return showAlert("No permission to create incidents.", "danger");
    }
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      incidentID: null,
      date_reported: "",
      severity: "",
      resolved: "",
      follow_up_actions: "",
      prisonerIDs: [],
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Incident Management</h2>

      {alertMessage.message && (
        <div className={`alert alert-${alertMessage.type}`} role="alert">
          {alertMessage.message}
        </div>
      )}

      {showForm && (hasPermission("incidents.create") || hasPermission("incidents.edit")) && (
        <IncidentsForm
          form={form}
          setForm={setForm}
          isEditing={isEditing}
          prisoners={prisoners}
          handleSubmit={handleSubmit}
          handleClose={() => setShowForm(false)}
        />
      )}

      {!showForm && hasPermission("incidents.read") && (
        <IncidentsList
          incidents={incidents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleGoToCreate}
        />
      )}
    </div>
  );
};

export default IncidentsPage;