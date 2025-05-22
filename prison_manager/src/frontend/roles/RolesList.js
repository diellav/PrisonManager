import React from "react";

const RolesList = ({ roles, onEdit, onDelete, goToCreate }) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">Roles List</h4>
          {hasPermission("roles.create") && (
            <button className="btn btn-success" onClick={goToCreate}>
              + Create New Role
            </button>
          )}
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  {(hasPermission("roles.edit") || hasPermission("roles.delete")) && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.roleID}>
                    <td>{role.roleID}</td>
                    <td>{role.name_}</td>
                    <td>{role.description_}</td>
                    {(hasPermission("roles.edit") || hasPermission("roles.delete")) && (
                      <td>
                        {hasPermission("roles.edit") && (
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => onEdit(role)}
                          >
                            Edit
                          </button>
                        )}
                        {hasPermission("roles.delete") && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onDelete(role.roleID)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
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

export default RolesList;
