import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import AppointmentForm from "./appointmentsForm";
import AppointmentsList from "./appointmentsList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [prisonerList, setPrisonerList] = useState([]); 
  const [users, setUsers] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasPermission("appointments.read")) {
      fetchAppointments();
      fetchStaffList();
      fetchUsers();
      fetchPrisonerList(); 
    } else {
      setLoading(false);
      setError("You do not have permission to view appointments.");
    }
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Error fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

 
const fetchUsers = async () => {
  try {
    const res = await axiosInstance.get("/users");
    setUsers(res.data);
  } catch (err) {
    console.error("Error fetching users:", err);
    setUsers([]);
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

  const fetchPrisonerList = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisonerList(res.data);
    } catch (err) {
      console.error("Error fetching prisoner list:", err);
      setPrisonerList([]);
    }
  };

  const goToCreate = () => {
    if (!hasPermission("appointments.create")) return;
    setEditingAppointment(null);
    setShowForm(true);
  };

  const onEdit = (appointment) => {
    if (!hasPermission("appointments.edit")) return;
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!hasPermission("appointments.delete")) return;

    try {
      await axiosInstance.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.appointment_ID !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment.");
    }
  };

  const onSuccess = () => {
    setShowForm(false);
    fetchAppointments();
  };

  const onCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2>Appointments Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : showForm && (hasPermission("appointments.create") || hasPermission("appointments.edit")) ? (
        <AppointmentForm
          editingAppointment={editingAppointment}
          onSuccess={onSuccess}
          onCancel={onCancel}
          staffList={staffList}
          prisonerList={prisonerList}
        />
      ) : hasPermission("appointments.read") ? (
        <AppointmentsList
          appointments={appointments}
          prisoners={prisonerList}      
          medicalStaff={staffList}
          users={users} 
          onEdit={onEdit}
          onDelete={onDelete}
          goToCreate={goToCreate}
        />
      ) : null}
    </div>
  );
};

export default AppointmentsPage;
