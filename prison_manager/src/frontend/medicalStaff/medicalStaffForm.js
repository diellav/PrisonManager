import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axiosInstance from "../axios";

const MedicalStaffForm = ({ selectedMedicalStaff, setSelectedMedicalStaff, fetchMedicalStaffs }) => {
  const [formData, setFormData] = useState({
    userID: "",
    specialty: "",
  });
const [errorMsg, setErrorMsg] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedMedicalStaff) {
      setFormData({
        userID: selectedMedicalStaff.userID,
        specialty: selectedMedicalStaff.specialty,
      });
    } else {
      setFormData({
        userID: "",
        specialty: "",
      });
    }
  }, [selectedMedicalStaff]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMedicalStaff) {
        await axiosInstance.put(`/medicalStaff/${selectedMedicalStaff.medical_staff_ID}`, formData);
      } else {
        await axiosInstance.post("/medicalStaff", formData);
      }
      fetchMedicalStaffs();
      setSelectedMedicalStaff(null);
    } catch (err) {
      console.error("Error saving medical staff:", err);
    }
  };

  const handleCancel = () => {
    setSelectedMedicalStaff(null);
  };

  if (formData.password !== formData.confirmPassword) {
  setErrorMsg("Passwords do not match");
  return;
}
  return (
    <Card className="p-4 my-3">
      <h4>{selectedMedicalStaff ? "Edit Medical Staff" : "Add Medical Staff"}</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>User</label>
            <select
              className="form-control"
              name="userID"
              value={formData.userID}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.userID} value={user.userID}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Specialty</label>
            <input
              type="text"
              className="form-control"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary me-2">
            {selectedMedicalStaff ? "Update" : "Create"}
          </button>
          {selectedMedicalStaff && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default MedicalStaffForm;
