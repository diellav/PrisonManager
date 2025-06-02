import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const StaffScheduleForm = ({ editingSchedule, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    
    userID: "",
    shift_type: "",
    shift_start: "",
    shift_end: "",
    date_: "",
    repeatWeekly: false,
    repeatWeeks: 0,
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingSchedule) {
  const toTime = (dateStr) =>
      new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const pad = (num) => num.toString().padStart(2, "0");

      setForm({
        userID: editingSchedule.userID || "",
        shift_type: editingSchedule.shift_type || "",
       shift_start: editingSchedule.shift_start
        ? toTime(editingSchedule.shift_start)
        : "",
       shift_end: editingSchedule.shift_end
        ? toTime(editingSchedule.shift_end)
        : "",
        date_: editingSchedule.date_?.split("T")[0] || "",
        repeatWeekly: editingSchedule.repeatWeekly || false,
        repeatWeeks: editingSchedule.repeatWeeks || 0,
      });
    }
  }, [editingSchedule]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userID || !form.shift_type || !form.shift_start || !form.shift_end || !form.date_) {
      setError("Please fill in all fields.");
      return;
    }

    const payload = {
      userID: form.userID,
      shift_type: form.shift_type,
      shift_start: `${form.date_}T${form.shift_start}:00`,
      shift_end: `${form.date_}T${form.shift_end}:00`,
      date_: form.date_,
      repeatWeekly: form.repeatWeekly,
      repeatWeeks: form.repeatWeeks,
    };

    try {
      if (editingSchedule) {
        await axiosInstance.put(`/staff_schedule/${editingSchedule.staff_schedule_ID}`, payload);
      } else {
        await axiosInstance.post("/staff_schedule", payload);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error saving schedule:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to save schedule.");
      }
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {editingSchedule ? "Edit Staff Schedule" : "Create Staff Schedule"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
        
            <div className="col-md-6 mb-3">
              <label className="form-label">User</label>
              <select
                name="userID"
                value={form.userID}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.userID} value={user.userID}>
                    {user.first_name} {user.last_name} (ID: {user.userID})
                  </option>
                ))}
              </select>
            </div>

          
            <div className="col-md-6 mb-3">
              <label className="form-label">Shift Type</label>
              <input
                type="text"
                name="shift_type"
                value={form.shift_type}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

           
            <div className="col-md-6 mb-3">
              <label className="form-label">Shift Start</label>
              <input
                type="time"
                name="shift_start"
                value={form.shift_start}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Shift End</label>
              <input
                type="time"
                name="shift_end"
                value={form.shift_end}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

         
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
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="repeatWeekly"
                  checked={form.repeatWeekly || false}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      repeatWeekly: e.target.checked,
                    }))
                  }
                  id="repeatWeekly"
                />
                <label className="form-check-label" htmlFor="repeatWeekly">
                  Repeat weekly
                </label>
              </div>
            </div>

         
            {form.repeatWeekly && (
              <div className="col-md-6 mb-3">
                <label className="form-label">Number of weeks to repeat</label>
                <input
                  type="number"
                  name="repeatWeeks"
                  min="1"
                  value={form.repeatWeeks || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            )}
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
              {editingSchedule ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffScheduleForm;
