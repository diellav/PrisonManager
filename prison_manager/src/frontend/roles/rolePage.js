import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

import RoleForm from "./RoleForm";
import RolesList from "./RolesList";

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

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
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
  };const handleSubmit = async (e) => {
  e.preventDefault();

  const dataToSend = {
    ...form,
    permissionIDs: form.permissionIDs,
  };

  try {
    if (isEditing) {
      await axiosInstance.put(`/roles/${form.id}`, dataToSend);
    } else {
      await axiosInstance.post('/roles', dataToSend);
    }
    setShowForm(false);
    fetchRoles();
  } catch (error) {
    console.error('Failed to save role:', error);
  }
};

const handleEdit = async (role) => {
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
    console.error("Error fetching role details:", error);
  }
};


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axiosInstance.delete(`/roles/${id}`);
        fetchRoles();
      } catch (err) {
        console.error("Error deleting role:", err.response?.data || err.message);
      }
    }
  };

  const handleGoToCreate = () => {
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
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <RoleForm
        showModal={showForm}
        handleClose={() => setShowForm(false)}
        form={form}
        setForm={setForm}
        isEditing={isEditing}
        permissions={permissions}
        handleSubmit={handleSubmit}
      />

      <RolesList
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        goToCreate={handleGoToCreate}
      />
    </div>
  );
};

export default RolePage;
