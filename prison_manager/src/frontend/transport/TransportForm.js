import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const TransportForm = ({
  editingTransport,
  onSuccess,
  onCancel,
  prisoners,
  guards,
  vehicles,
}) => {
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

  const [error, setError] = useState("");
useEffect(() => {
  if (editingTransport) {
    let date = editingTransport.transport_date;
    if (date) {
      date = date.slice(0, 16);
    }
    setForm({
      prisonerID: editingTransport.prisonerID || "",
      departure_location: editingTransport.departure_location || "",
      destination_location: editingTransport.destination_location || "",
      transport_date: date || "",
      transport_reason: editingTransport.transport_reason || "",
      status_: editingTransport.status_ || "",
      guard_ID: editingTransport.guard_ID ? editingTransport.guard_ID.toString() : "",
      vehicle_ID: editingTransport.vehicle_ID ? editingTransport.vehicle_ID.toString() : "",
    });
  } else {
    setForm({
      prisonerID: "",
      departure_location: "",
      destination_location: "",
      transport_date: "",
      transport_reason: "",
      status_: "",
      guard_ID: "",
      vehicle_ID: "",
    });
  }
}, [editingTransport]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.prisonerID ||
      !form.departure_location ||
      !form.destination_location ||
      !form.transport_date ||
      !form.transport_reason ||
      !form.status_ ||
      !form.guard_ID ||
      !form.vehicle_ID
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const payload = {
      prisonerID: form.prisonerID,
      departure_location: form.departure_location,
      destination_location: form.destination_location,
      transport_date: form.transport_date,
      transport_reason: form.transport_reason,
      status_: form.status_,
      guard_ID: parseInt(form.guard_ID, 10),
      vehicle_ID: parseInt(form.vehicle_ID, 10),
    };

    try {
      if (editingTransport) {
        await axiosInstance.put(`/transport/${editingTransport.transport_ID}`, payload);
      } else {
        await axiosInstance.post("/transport", payload);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to save transport:", err);
      setError("Failed to save transport. Please try again.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingTransport ? "Edit Transport" : "Create Transport"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">Prisoner</label>
              <select
                name="prisonerID"
                className="form-select"
                value={form.prisonerID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Prisoner --</option>
                {prisoners.map((p) => (
                  <option key={p.prisonerID} value={p.prisonerID}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Departure Location</label>
              <input
                type="text"
                name="departure_location"
                value={form.departure_location}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Destination Location</label>
              <input
                type="text"
                name="destination_location"
                value={form.destination_location}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Transport Date</label>
              <input
                type="datetime-local"
                name="transport_date"
                value={form.transport_date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Reason</label>
              <textarea
                name="transport_reason"
                value={form.transport_reason}
                onChange={handleChange}
                className="form-control"
                required
                rows={3}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Status</label>
              <input
                type="text"
                name="status_"
                value={form.status_}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Guard</label>
              <select
                name="guard_ID"
                className="form-select"
                value={form.guard_ID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Guard --</option>
                {guards.map((g) => (
                  <option key={g.guard_staff_ID} value={g.guard_staff_ID}>
                    {g.first_name} {g.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Vehicle</label>
              <select
                name="vehicle_ID"
                className="form-select"
                value={form.vehicle_ID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.vehicle_ID} value={v.vehicle_ID}>
                    {v.type_} - {v.plate_number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTransport ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransportForm;