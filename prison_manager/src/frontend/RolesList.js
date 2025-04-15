import React from "react";

const RolesList = ({ roles, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Roles List</h2>
        <button className="btn btn-success" onClick={goToCreate}>+ Create New Role</button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.roleID}>
              <td>{role.roleID}</td>
              <td>{role.name_}</td>
              <td>{role.description_}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(role)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(role.roleID)}>
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

export default RolesList;
