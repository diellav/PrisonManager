import React, { useEffect, useState } from "react";
import MedicalRecordsList from "./medicalRecordsList";
import MedicalRecordForm from "./medicalRecordsForm";
import axiosInstance from "../axios";

const MedicalRecordPage = () => {
  const [records, setRecords] = useState([]);
  const [prisoners, setPrisoners] = useState([]);
  const [medicalStaff, setMedicalStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsRes, prisonersRes, staffRes, usersRes] = await Promise.all([
        axiosInstance.get("/medical_records"),
        axiosInstance.get("/prisoners"),
        axiosInstance.get("/medical_staff"),
        axiosInstance.get("/users"),
      ]);
      setRecords(recordsRes.data);
      setPrisoners(prisonersRes.data);
      setMedicalStaff(staffRes.data);
      setUsers(usersRes.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching medical records data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission("medical_records.read")) {
      fetchData();
    } else {
      setLoading(false);
      setError("You do not have permission to view medical records.");
    }
  }, []);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (!data.record_ID || data.record_ID === 0) {
        await axiosInstance.post("/medical_records", data);
      } else {
        await axiosInstance.put(`/medical_records/${data.record_ID}`, data);
      }
      setSelectedRecord(null);
      fetchData();
    } catch (error) {
      console.error("Error saving medical record:", error);
      setError("Failed to save medical record.");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("medical_records.delete")) return;

    try {
      await axiosInstance.delete(`/medical_records/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting medical record:", error);
      setError("Failed to delete medical record.");
    }
  };

  const goToCreate = () => {
    if (!hasPermission("medical_records.create")) return;
    setSelectedRecord({});
  };

  const onCancel = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="container mt-4">
      <h2>Medical Records Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : selectedRecord && (hasPermission("medical_records.create") || hasPermission("medical_records.edit")) ? (
        <MedicalRecordForm
          record={selectedRecord}
          onSubmit={handleCreateOrUpdate}
          onCancel={onCancel}
          prisoners={prisoners}
          medicalStaff={medicalStaff}
          users={users}
        />
      ) : hasPermission("medical_records.read") ? (
        <>
          <MedicalRecordsList
            records={records}
            prisoners={prisoners}
            medicalStaff={medicalStaff}
            users={users}
            onEdit={(rec) => setSelectedRecord(rec)}
            onDelete={handleDelete}
            goToCreate={goToCreate}
          />
        </>
      ) : null}
    </div>
  );
};

export default MedicalRecordPage;
