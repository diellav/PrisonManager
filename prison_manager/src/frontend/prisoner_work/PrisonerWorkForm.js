import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const PrisonerWorkForm = ({ editingWork, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    prisonerID: "",
    work_type: "",
    work_hours: "",
    work_status: "",
  });

  const [error, setError] = useState("");
  const [prisoners, setPrisoners] = useState([]);

  useEffect(() => {
    const fetchPrisoners = async () => {
      try {
        const prisonersRes = await axiosInstance.get("/prisoners");
        setPrisoners(prisonersRes.data);
      } catch (err) {
        console.error("Failed to fetch prisoners:", err);
      }
    };
    fetchPrisoners();
  }, []);

  useEffect(() => {
    if (editingWork) {
      setForm({
        prisonerID: editingWork.prisonerID || "",
        work_type: editingWork.work_type || "",
        work_hours: editingWork.work_hours || "",
        work_status: editingWork.work_status || "",
      });
    } else {
      setForm({
        prisonerID: "",
        work_type: "",
        work_hours: "",
        work_status: "",
      });
    }
  }, [editingWork]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingWork) {
        await axiosInstance.put(`/prisoner_work/${editingWork.prisoner_work_ID}`, {
          ...form,
          prisonerID: parseInt(form.prisonerID),
        });
      } else {
        await axiosInstance.post("/prisoner_work", {
          ...form,
          prisonerID: parseInt(form.prisonerID),
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving prisoner work:", err);
      setError("Failed to save prisoner work.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingWork ? "Edit Prisoner Work" : "Create Prisoner Work"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Prisoner Dropdown */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Prisoner</label>
              <select
                className="form-select"
                name="prisonerID"
                value={form.prisonerID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Prisoner --</option>
                {prisoners.map((prisoner) => (
                  <option key={prisoner.prisonerID} value={prisoner.prisonerID}>
                    {prisoner.first_name} {prisoner.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Work Type</label>
              <input
                type="text"
                className="form-control"
                name="work_type"
                value={form.work_type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Work Hours</label>
              <input
                type="text"
                className="form-control"
                name="work_hours"
                value={form.work_hours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Work Status</label>
              <input
                type="text"
                className="form-control"
                name="work_status"
                value={form.work_status}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingWork ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrisonerWorkForm;
