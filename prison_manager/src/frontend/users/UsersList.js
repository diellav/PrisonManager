import React from "react";
const roleMap = {
  1:"SuperAdmin",
  2: "Warden",
  3: "Prisoner Manager",
  4: "Visitor Manager",
  5: "Prison Finance Manager",
  6: "Prisoner Finance Manager",
  7: "Legal Matters Manager",
  8: "Guard Staff",
  9: "Medical Staff",
  10: "Kitchen Staff",
  11: "Maintenance Staff",
  12: "Transport Staff",
  13: "Visitor",
};

const getValidImage = (url) => {
  return url && url !== "" ? url : "/default-avatar.png";
};

const UsersList = ({ users, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">Users List</h4>
          <button className="btn btn-success" onClick={goToCreate}>
            + Create New User
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
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
            <th>Role</th>
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
              <td>{roleMap[user.roleID]}</td>
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
        </div>
      </div>
    </div>
  );
};


export default UsersList;

