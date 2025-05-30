import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const UserForm = ({
  form,
  isEditing,
  handleInputChange,
  handleSubmit,
  handleClose,
  setFile,
}) => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles");
        setRoles(response.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to load roles.");
      }
    };
    fetchRoles();
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit User" : "Create User"}
        </h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          encType="multipart/form-data"
        >
          <div className="row">
            {[
              { label: "First Name", name: "first_name" },
              { label: "Last Name", name: "last_name" },
              { label: "Date of Birth", name: "date_of_birth", type: "date" },
              { label: "Phone", name: "phone" },
              { label: "Address", name: "address_" },
              { label: "Email", name: "email", type: "email" },
              { label: "Username", name: "username" },
              { label: "Password", name: "password_", type: "password" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name} className="col-md-6 mb-3">
                <label>{label}</label>
                <input
                  type={type}
                  className="form-control"
                  name={name}
                  value={form[name] || ""}
                  onChange={handleInputChange}
                  required={name !== "password_" || !isEditing}
                />
              </div>
            ))}

            <div className="col-md-6 mb-3">
              <label>Photo</label>
              <input
                type="file"
                className="form-control"
                name="photo"
                onChange={onFileChange}
                accept="image/*"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Gender</label>
              <select
                className="form-control"
                name="gender"
                value={form.gender || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>Role</label>
              <select
                className="form-control"
                name="roleID"
                value={form.roleID || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.roleID} value={role.roleID}>
                    {role.name_}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleClose}
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

export default UserForm;
