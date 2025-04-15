import React from "react";

const EmergencyContactsList = ({ contacts, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Emergency Contacts List</h2>
        <button className="btn btn-success" onClick={goToCreate}>+ Create New Contact</button>
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
  );
};

export default EmergencyContactsList;
