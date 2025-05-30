import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const CaseForm = ({ editingCase, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    description_: "",
    status_: "",
    prisonerID: "",
    lawyer_ID: "",
  });

  const [prisoners, setPrisoners] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrisoners();
    fetchLawyers();
  }, []);

  useEffect(() => {
    if (editingCase) {
      setForm({
        description_: editingCase.description_ || "",
        status_: editingCase.status_ || "",
        prisonerID: editingCase.prisonerID || "",
        lawyer_ID: editingCase.lawyer_ID || "",
      });
    }
  }, [editingCase]);

  const fetchPrisoners = async () => {
    try {
      const res = await axiosInstance.get("/prisoners");
      setPrisoners(res.data);
    } catch (err) {
      console.error("Error fetching prisoners", err);
      setPrisoners([]);
    }
  };

  const fetchLawyers = async () => {
    try {
      const res = await axiosInstance.get("/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.error("Error fetching lawyers", err);
      setLawyers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCase) {
        await axiosInstance.put(`/cases/${editingCase.case_ID}`, form);
      } else {
        await axiosInstance.post("/cases", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving case:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to save case.");
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingCase ? "Edit Case" : "Create Case"}
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
              <label className="form-label">Lawyer</label>
              <select
                name="lawyer_ID"
                value={form.lawyer_ID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Lawyer --</option>
                {lawyers.map((l) => (
                  <option key={l.lawyer_ID} value={l.lawyer_ID}>
                    {l.first_name} {l.last_name} (ID: {l.lawyer_ID})
                  </option>
                ))}
              </select>
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

            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description_"
                value={form.description_}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              />
            </div>

          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCase ? "Update Case" : "Create Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;
