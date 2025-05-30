import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import UserForm from "./UsersForm";
import UsersList from "./UsersList";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [transportStaff, setTransportStaff] = useState([]);
  const [form, setForm] = useState(initialFormState());
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);

  function initialFormState() {
    return {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      phone: "",
      address_: "",
      email: "",
      username: "",
      password_: "",
      photo: "",
      roleID: "",
      transport_role: "",
      id: null,
    };
  }

  useEffect(() => {
    fetchUsers();
    fetchTransportStaff();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const fetchTransportStaff = async () => {
    try {
      const res = await axiosInstance.get("/transport_staff");
      setTransportStaff(res.data);
    } catch (err) {
      console.error("Error fetching transport staff:", err.response?.data || err.message);
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

  const usersWithTransportRole = users.map((user) => {
    const ts = transportStaff.find((t) => t.userID === user.userID);
    return {
      ...user,
      transport_role: ts ? ts.transport_role : "",
    };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState());
    setFile(null);
    setIsEditing(false);
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      console.log("Form data before sending:", form);
      const formData = new FormData();
      for (const key in form) {
        if (key !== "id" && form[key] !== null && form[key] !== undefined) {
          if (key === "password_" && isEditing && !form[key]) continue;
          formData.append(key, form[key]);
        }
      }

      if (form.roleID) {
        formData.set("roleID", Number(form.roleID));
      }

      if (file) {
        formData.append("photo", file);
      }

     if (!isEditing && form.roleID) {
  const selectedRole = roles.find((r) => r.roleID === Number(form.roleID));
  if (selectedRole && selectedRole.name_.toLowerCase().includes("transport")) {
    let cleanTransportRole = form.transport_role;
    if (typeof cleanTransportRole === "string") {
      const parts = cleanTransportRole.split(",").map(p => p.trim());
      cleanTransportRole = [...new Set(parts)].join(",");
    }

    formData.set("transport_role", cleanTransportRole);
  }
}


      if (isEditing) {
        await axiosInstance.put(`/users/${form.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchUsers();
      fetchTransportStaff(); 
    } catch (err) {
      console.error("Error saving user:", err.response?.data || err.message);
    }
  };

  const handleEdit = (user) => {
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      date_of_birth: user.date_of_birth?.split("T")[0] || "",
      gender: user.gender,
      phone: user.phone,
      address_: user.address_,
      email: user.email,
      username: user.username,
      photo: user.photo,
      roleID: user.roleID,
      transport_role: user.transport_role || "",
      id: user.userID,
    });
    setFile(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        fetchUsers();
        fetchTransportStaff();
      } catch (err) {
        console.error("Error deleting user:", err.response?.data || err.message);
      }
    }
  };

  const handleModalOpen = () => {
    resetForm();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const getRoleName = (roleID) => {
    const role = roles.find((r) => r.roleID === roleID);
    return role ? role.name_ : "Unknown";
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Users Management</h2>
      {showModal ? (
        <UserForm
          form={form}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleClose={handleModalClose}
          setFile={setFile}
          roles={roles}
        />
      ) : (
        <UsersList
          users={usersWithTransportRole}
          onEdit={handleEdit}
          onDelete={handleDelete}
          goToCreate={handleModalOpen}
          getRoleName={getRoleName}
        />
      )}
    </div>
  );
};

export default UserPage;
