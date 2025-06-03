import React, { useEffect, useState } from "react";

const SecurityLogsForm = ({
  form,
  incidents = [],
  guards = [],
  isEditing,
  handleInputChange,
  handleSubmit,
  onCancel,
  setForm,
}) => {
  const [selectedGuard, setSelectedGuard] = useState(null);

useEffect(() => {
  if (!isEditing && (!form.time_stamp || form.time_stamp === "")) {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
    setForm((prev) => ({ ...prev, time_stamp: localISOTime }));
  }
}, [isEditing, setForm]);


  useEffect(() => {
    if (form.reporting_guard_ID) {
      const guard = guards.find(
        (g) => g.guard_staff_ID === Number(form.reporting_guard_ID)
      );
      setSelectedGuard(guard || null);
    } else {
      setSelectedGuard(null);
    }
  }, [form.reporting_guard_ID, guards]);

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit Security Log" : "Create Security Log"}
        </h4>
      </div>
      <div className="card-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="event_type">Event Type</label>
              <input
                type="text"
                id="event_type"
                className="form-control"
                name="event_type"
                value={form.event_type || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="location_">Location</label>
              <input
                type="text"
                id="location_"
                className="form-control"
                name="location_"
                value={form.location_ || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="description_">Description</label>
              <textarea
                id="description_"
                className="form-control"
                name="description_"
                value={form.description_ || ""}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="action_taken">Action Taken</label>
              <textarea
                id="action_taken"
                className="form-control"
                name="action_taken"
                value={form.action_taken || ""}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="time_stamp">Timestamp</label>
              <input
                type="datetime-local"
                id="time_stamp"
                className="form-control"
                name="time_stamp"
                value={form.time_stamp || ""}
                onChange={handleInputChange}
                required
                disabled={isEditing} 
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="incident_ID">Incident</label>
              <select
                id="incident_ID"
                name="incident_ID"
                className="form-control"
                value={form.incident_ID || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Incident</option>
                {incidents.map((incident) => (
                  <option key={incident.incident_ID} value={incident.incident_ID}>
                    ID: {incident.incident_ID} Date: {incident.date_reported?.slice(0, 10)}
                    </option>

                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="reporting_guard_ID">Reporting Guard</label>
              <select
                id="reporting_guard_ID"
                name="reporting_guard_ID"
                className="form-control"
                value={form.reporting_guard_ID || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Guard</option>
                {guards.map((guard) => (
                  <option key={guard.guard_staff_ID} value={guard.guard_staff_ID}>
                    {guard.first_name} {guard.last_name} (ID: {guard.guard_staff_ID})
                  </option>
                ))}
              </select>
              <div className="mt-1">
                <small className="text-muted">
                  Selected:{" "}
                  {selectedGuard
                    ? `${selectedGuard.first_name} ${selectedGuard.last_name}`
                    : "None"}
                </small>
              </div>
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
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityLogsForm;
