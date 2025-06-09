
import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const TransportForm = ({ editingTransport, onSuccess, onCancel, prisoners, guards, vehicles }) => {
  const [form, setForm] = useState({
    prisonerID: "",
    departure_location: "",
    destination_location: "",
    transport_date: "",
    transport_reason: "",
    status_: "",
    guard_ID: "",
    vehicle_ID: "",
  });

  useEffect(() => {
    if (editingTransport) {
      setForm(editingTransport);
    }
  }, [editingTransport]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransport) {
        await axiosInstance.put(`/transport/${editingTransport.transport_ID}`, form);
      } else {
        await axiosInstance.post("/transport", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save transport:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Prisoner</label>
        <select name="prisonerID" className="form-control" value={form.prisonerID} onChange={handleChange} required>
          <option value="">Select Prisoner</option>
          {prisoners.map((p) => (
            <option key={p.prisonerID} value={p.prisonerID}>{p.first_name} {p.last_name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Departure Location</label>
        <input type="text" name="departure_location" className="form-control" value={form.departure_location} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Destination Location</label>
        <input type="text" name="destination_location" className="form-control" value={form.destination_location} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Transport Date</label>
        <input type="datetime-local" name="transport_date" className="form-control" value={form.transport_date} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Reason</label>
        <textarea name="transport_reason" className="form-control" value={form.transport_reason} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Status</label>
        <input type="text" name="status_" className="form-control" value={form.status_} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Guard</label>
        <select name="guard_ID" className="form-control" value={form.guard_ID} onChange={handleChange} required>
          <option value="">Select Guard</option>
          {guards.map((g) => (
            <option key={g.guard_staff_ID} value={g.guard_staff_ID}>{g.first_name} {g.last_name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Vehicle</label>
        <select name="vehicle_ID" className="form-control" value={form.vehicle_ID} onChange={handleChange} required>
          <option value="">Select Vehicle</option>
          {vehicles.map((v) => (
            <option key={v.vehicle_ID} value={v.vehicle_ID}>{v.vehicle_type}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary mr-2">{editingTransport ? "Update" : "Create"}</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default TransportForm;
