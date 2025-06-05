import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const AppointmentForm = ({ editingAppointment, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    prisonerID: "",
    medical_staff_ID: "",
    date_: "",
  });

  const [prisoners, setPrisoners] = useState([]);
  const [medicalStaff, setMedicalStaff] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrisoners();
    fetchMedicalStaff();
  }, []);

  useEffect(() => {
    if (editingAppointment) {
      setForm({
        prisonerID: editingAppointment.prisonerID || "",
        medical_staff_ID: editingAppointment.medical_staff_ID || "",
        date_: editingAppointment.date_ ? editingAppointment.date_.split("T")[0] : "",
      });
    } else {
      setForm({
        prisonerID: "",
        medical_staff_ID: "",
        date_: "",
      });
    }
  }, [editingAppointment]);

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Error fetching prisoners", err);
      setPrisoners([]);
    }
  };

  const fetchMedicalStaff = async () => {
    try {
      const res = await axiosInstance.get("/medical_staff");
      setMedicalStaff(res.data);
    } catch (err) {
      console.error("Error fetching medical staff", err);
      setMedicalStaff([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "prisonerID" || name === "medical_staff_ID" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingAppointment) {
        await axiosInstance.put(`/appointments/${editingAppointment.appointment_ID}`, form);
      } else {
        await axiosInstance.post("/appointments", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving appointment:", err);
      setError("Failed to save appointment.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingAppointment ? "Edit Appointment" : "Create Appointment"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Patient</label>
              <select
                className="form-select"
                name="prisonerID"
                value={form.prisonerID}
                onChange={handleChange}
                required
              >
                <option value="">Select Prisoner</option>
                {prisoners.map((prisoner) => (
                  <option key={prisoner.prisonerID} value={prisoner.prisonerID}>
                    {prisoner.first_name} {prisoner.last_name} Id:{prisoner.prisonerID}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Medical Staff</label>
              <select
                name="medical_staff_ID"
                value={form.medical_staff_ID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Medical Staff --</option>
                {medicalStaff.map((staff) => (
                  <option key={staff.medical_staff_ID} value={staff.medical_staff_ID}>
                    {staff.first_name} {staff.last_name} (User ID: {staff.userID})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Appointment Date</label>
              <input
                type="date"
                name="date_"
                value={form.date_}
                onChange={handleChange}
                className="form-control"
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
              {editingAppointment ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
