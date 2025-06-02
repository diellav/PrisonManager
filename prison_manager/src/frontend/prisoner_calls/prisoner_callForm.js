import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const PrisonerCallForm = ({ editingCall, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    call_date: "",
    duration: "",
    prisonerID: "",
  });

  const [prisoners, setPrisoners] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrisoners();
  }, []);

  useEffect(() => {
    if (editingCall) {
      setForm({
        call_date: editingCall.call_date?.slice(0, 10) || "",
        duration: editingCall.duration || "",
        prisonerID: editingCall.prisonerID || "",
      });
    }
  }, [editingCall]);

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
      if (editingCall) {
        await axiosInstance.put(`/prisoner_calls/${editingCall.prisoner_call_ID}`, form);
      } else {
        await axiosInstance.post("/prisoner_calls", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving prisoner call:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to save prisoner call.");
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingCall ? "Edit Prisoner Call" : "Create Prisoner Call"}
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
              <label className="form-label">Call Date</label>
              <input
                type="date"
                name="call_date"
                value={form.call_date}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Duration</label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCall ? "Update Call" : "Create Call"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrisonerCallForm;
