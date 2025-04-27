import React from "react";

const EmergencyContactsList = ({ contacts, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">Emergency Contact List</h4>
          <button className="btn btn-success" onClick={goToCreate}>
            + Create New Emergency Contact
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.emergency_contact_ID}>
              <td>{contact.emergency_contact_ID}</td>
              <td>{contact.first_name}</td>
              <td>{contact.last_name}</td>
              <td>{contact.date_of_birth}</td>
              <td>{contact.gender}</td>
              <td>{contact.phone}</td>
              <td>{contact.address_}</td>
              <td>{contact.email}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(contact)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(contact.emergency_contact_ID)}>
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

export default EmergencyContactsList;
