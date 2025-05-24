import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import RoleForm from "./RoleForm";
import RolesList from "./RolesList";

const hasPermission = (permName) => {
  const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
  return perms.includes(permName.toLowerCase());
};

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    id: null,
    permissionIDs: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (hasPermission("roles.read")) {
      fetchRoles();
    }
    if (hasPermission("roles.create") || hasPermission("roles.edit")) {
      fetchPermissions();
    }
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await axiosInstance.get("/roles/permissions");
      setPermissions(res.data);
    } catch (err) {
      console.error("Error fetching permissions:", err.response?.data || err.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err.response?.data || err.message);
    }
  };

  const showAlert = (message, type = "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: form.name,
      description: form.description,
      permissionIDs: form.permissionIDs,
    };

    try {
      if (isEditing && hasPermission("roles.edit")) {
        await axiosInstance.put(`/roles/${form.id}`, dataToSend);
      } else if (!isEditing && hasPermission("roles.create")) {
        await axiosInstance.post('/roles', dataToSend);
      } else {
        return showAlert("You don't have permission to perform this action.", "danger");
      }
      setShowForm(false);
      fetchRoles();
      resetForm();
    } catch (error) {
      if (error.response?.status === 403) {
        showAlert("Access denied: You do not have the required permission.", "danger");
      } else {
        showAlert("Failed to save role. Please try again.", "danger");
      }
      console.error('Failed to save role:', error.response?.data || error.message);
    }
  };
const handleEdit = async (role) => {
  if (!hasPermission("roles.edit")) {
    alert("No permission to edit roles.");
    return;
  }

  try {
    const res = await axiosInstance.get(`/roles/${role.roleID}`);
    const roleData = res.data;
    setForm({
      name: roleData.name_,
      description: roleData.description_,
      id: roleData.roleID,
      permissionIDs: roleData.permissionIDs || [],
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    if (error.response?.status === 403) {
      alert("Access denied: You do not have permission to edit this role.");
    } else {
      alert("Failed to fetch role details.");
    }
    console.error("Error fetching role details:", error.response?.data || error.message);
  }
};


  const handleDelete = async (id) => {
    if (!hasPermission("roles.delete")) return showAlert("No permission to delete roles.", "danger");
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axiosInstance.delete(`/roles/${id}`);
        fetchRoles();
      } catch (err) {
        showAlert("Failed to delete role.", "danger");
        console.error("Error deleting role:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
    if (!hasPermission("roles.create")) return showAlert("No permission to create roles.", "danger");
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      id: null,
      permissionIDs: [],
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Roles Management</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

       {showForm && (hasPermission("roles.create") || hasPermission("roles.edit")) && (
  <RoleForm
    showModal={true}
     handleClose={() => setShowForm(false)}
    form={form}
    setForm={setForm}
    isEditing={isEditing}
    permissions={permissions}
    handleSubmit={handleSubmit}
    showAlert={showAlert}  
  />
)}

{!showForm && hasPermission("roles.read") && (
  <RolesList
    roles={roles}
    onEdit={handleEdit}
    onDelete={handleDelete}
    goToCreate={handleGoToCreate}
  />
)}
    </div>
  );
};

export default RolePage;
