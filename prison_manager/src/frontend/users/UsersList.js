import React from "react";

const getValidImage = (url) => {
  return url && url !== "" ? url : "/default-avatar.png";
};

const UsersList = ({ users, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Users List</h2>
        <button className="btn btn-success" onClick={goToCreate}>+ Create New User</button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Email</th>
            <th>Username</th>
            <th>Photo</th>
            <th>Role ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.date_of_birth?.split("T")[0]}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.address_}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>
                <img
                  src={getValidImage(user.photo)}
                  alt="User"
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }}
                />
              </td>
              <td>{user.roleID}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(user.userID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;

