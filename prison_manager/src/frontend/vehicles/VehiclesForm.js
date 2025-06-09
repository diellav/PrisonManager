import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const VehiclesForm = ({ editingVehicle, onSuccess, onCancel, transportStaff }) => {
  const [form, setForm] = useState({
    plate_number: "",
    type_: "",
    capacity: "",
    status_: "",
    transport_staff_ID: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingVehicle) {
      setForm({
        plate_number: editingVehicle.plate_number || "",
        type_: editingVehicle.type_ || "",
        capacity: editingVehicle.capacity ? editingVehicle.capacity.toString() : "",
        status_: editingVehicle.status_ || "",
        transport_staff_ID: editingVehicle.transport_staff_ID
          ? editingVehicle.transport_staff_ID.toString()
          : "",
      });
    } else {
      setForm({
        plate_number: "",
        type_: "",
        capacity: "",
        status_: "",
        transport_staff_ID: "",
      });
    }
  }, [editingVehicle]);

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
      !form.plate_number ||
      !form.type_ ||
      !form.capacity ||
      !form.status_ ||
      !form.transport_staff_ID
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const payload = {
      plate_number: form.plate_number,
      type_: form.type_,
      capacity: parseInt(form.capacity, 10),
      status_: form.status_,
      transport_staff_ID: parseInt(form.transport_staff_ID, 10),
    };

    try {
      if (editingVehicle) {
        await axiosInstance.put(`/vehicles/${editingVehicle.vehicle_ID}`, payload);
      } else {
        await axiosInstance.post("/vehicles", payload);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error saving vehicle:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to save vehicle.");
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingVehicle ? "Edit Vehicle" : "Create Vehicle"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Plate Number</label>
              <input
                type="text"
                name="plate_number"
                value={form.plate_number}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Type</label>
              <input
                type="text"
                name="type_"
                value={form.type_}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="form-control"
                required
                min="1"
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
              <label className="form-label">Transport Staff</label>
              <select
                name="transport_staff_ID"
                value={form.transport_staff_ID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Staff --</option>
                {transportStaff.map((staff) => (
                  <option key={staff.transport_staff_ID} value={staff.transport_staff_ID}>
                    {staff.first_name} {staff.last_name} (ID: {staff.transport_staff_ID})
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
              {editingVehicle ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiclesForm;
