import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const ParoleForm = ({ editingParole, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    prisonerID: "",
    request_date: "",
    decision_date: "",
    status_: "",
    conditions: "",
    notes: "",
  });

  const [prisoners, setPrisoners] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrisoners();
  }, []);

  useEffect(() => {
    if (editingParole) {
      setForm({
        prisonerID: editingParole.prisonerID || "",
        request_date: editingParole.request_date?.split("T")[0] || "",
        decision_date: editingParole.decision_date?.split("T")[0] || "",
        status_: editingParole.status_ || "",
        conditions: editingParole.conditions || "",
        notes: editingParole.notes || "",
      });
    }
  }, [editingParole]);

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Error fetching prisoners", err);
      setPrisoners([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingParole) {
        await axiosInstance.put(`/paroles/${editingParole.parole_ID}`, form);
      } else {
        await axiosInstance.post("/paroles", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving parole:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to save parole.");
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingParole ? "Edit Parole" : "Create Parole"}
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
                value={form.prisonerID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Prisoner --</option>
                {prisoners.map((p) => (
                  <option key={p.prisonerID} value={p.prisonerID}>
                    {p.first_name} {p.last_name} (ID: {p.prisonerID})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Request Date</label>
              <input
                type="date"
                name="request_date"
                value={form.request_date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Decision Date</label>
              <input
                type="date"
                name="decision_date"
                value={form.decision_date}
                onChange={handleChange}
                className="form-control"
                required
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
              <label className="form-label">Conditions</label>
              <input
                type="text"
                name="conditions"
                value={form.conditions}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingParole ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParoleForm;
