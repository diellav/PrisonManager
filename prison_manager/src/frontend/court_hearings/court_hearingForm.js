import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const CourtHearingForm = ({ editingHearing, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    date_: "",
    court_name: "",
    verdict: "",
    judge_ID: "",
    case_ID: "",
  });

  const [judges, setJudges] = useState([]);
  const [cases, setCases] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJudges();
    fetchCases();
  }, []);

  useEffect(() => {
    if (editingHearing) {
      setForm({
        date_: editingHearing.date_ ? editingHearing.date_.slice(0, 10) : "", 
        court_name: editingHearing.court_name || "",
        verdict: editingHearing.verdict || "",
        judge_ID: editingHearing.judge_ID || "",
        case_ID: editingHearing.case_ID || "",
      });
    }
  }, [editingHearing]);

  const fetchJudges = async () => {
    try {
      const res = await axiosInstance.get("/judges");
      setJudges(res.data);
    } catch (err) {
      console.error("Error fetching judges", err);
      setJudges([]);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await axiosInstance.get("/cases");
      setCases(res.data);
    } catch (err) {
      console.error("Error fetching cases", err);
      setCases([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHearing) {
        await axiosInstance.put(`/court_hearings/${editingHearing.court_hearingID}`, form);
      } else {
        await axiosInstance.post("/court_hearings", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving hearing:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to save hearing.");
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingHearing ? "Edit Court Hearing" : "Create Court Hearing"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date_"
                value={form.date_}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Court Name</label>
              <input
                type="text"
                name="court_name"
                value={form.court_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Verdict</label>
              <textarea
                name="verdict"
                value={form.verdict}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Judge</label>
              <select
                name="judge_ID"
                value={form.judge_ID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Judge --</option>
                {judges.map((j) => (
                  <option key={j.judge_ID} value={j.judge_ID}>
                    {j.first_name} {j.last_name} (ID: {j.judge_ID})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Case</label>
              <select
                name="case_ID"
                value={form.case_ID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Case --</option>
                {cases.map((c) => (
                  <option key={c.case_ID} value={c.case_ID}>
                    {c.description_.slice(0, 40)}... (ID: {c.case_ID})
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingHearing ? "Update" : "Create Hearing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourtHearingForm;
