import React from "react";

const LawyersList = ({ lawyers, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">Lawyer List</h4>
          <button className="btn btn-success" onClick={goToCreate}>
            + Create New Lawyer
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
            <th>Phone</th>
            <th>Email</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lawyers.map((lawyer) => (
            <tr key={lawyer.lawyer_ID}>
              <td>{lawyer.lawyer_ID}</td>
              <td>{lawyer.first_name}</td>
              <td>{lawyer.last_name}</td>
              <td>{lawyer.phone}</td>
              <td>{lawyer.email}</td>
              <td>{lawyer.category}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(lawyer)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(lawyer.lawyer_ID)}>Delete</button>
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

export default LawyersList;
