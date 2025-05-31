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
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [isTransportStaff, setIsTransportStaff] = useState(false);
  const [isKitchenStaff, setIsKitchenStaff] = useState(false);

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

  useEffect(() => {
    const selectedRole = roles.find((r) => r.roleID === Number(form.roleID));
    const name_ = selectedRole?.name_?.toLowerCase() || "";
    setSelectedRoleName(name_);
    setIsTransportStaff(name_.includes("transport"));
     setIsKitchenStaff(name_.includes("kitchen"));
  }, [form.roleID, roles]);

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
            ].map(({ label, name, type = "text" }) => (
              <div key={name} className="col-md-6 mb-3">
                <label>{label}</label>
                <input
                  type={type}
                  className="form-control"
                  name={name}
                  value={form[name] || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}

            {!isEditing && (
              <div className="col-md-6 mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password_"
                  value={form.password_ || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

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

            {isTransportStaff && (
              <div className="col-md-6 mb-3">
                <label>Transport Role</label>
                <input
                  type="text"
                  className="form-control"
                  name="transport_role"
                  value={form.transport_role}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
             {isKitchenStaff && (
              <div className="col-md-6 mb-3">
                <label>Kitchen Role</label>
                <input
                  type="text"
                  className="form-control"
                  name="kitchen_role"
                  value={form.kitchen_role}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
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
