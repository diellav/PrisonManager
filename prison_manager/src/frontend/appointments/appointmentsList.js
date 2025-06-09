import React, { useState } from "react";

const AppointmentsList = ({
  appointments,
  prisoners = [],
  medicalStaff = [],
  users = [],
  onEdit,
  onDelete,
  goToCreate,
}) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("appointment_ID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const getPrisonerName = (id) => {
    const prisoner = prisoners.find((p) => p.prisonerID === id);
    return prisoner ? `${prisoner.first_name} ${prisoner.last_name}` : "Unknown";
  };

  const getMedicalStaffName = (staffId) => {
    const staff = medicalStaff.find((m) => m.medical_staff_ID === staffId);
    if (!staff) return "Unknown";

    const user = users.find((u) => u.userID === staff.userID);
    return user ? `${user.first_name} ${user.last_name}` : "Unknown";
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const prisonerName = getPrisonerName(appointment.prisonerID).toLowerCase();
    const staffName = getMedicalStaffName(appointment.medical_staff_ID).toLowerCase();
    const dateString = (appointment.date_ || "").toLowerCase();

    return (
      prisonerName.includes(searchTerm.toLowerCase()) ||
      staffName.includes(searchTerm.toLowerCase()) ||
      dateString.includes(searchTerm.toLowerCase()) ||
      String(appointment.appointment_ID).includes(searchTerm)
    );
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "date_") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAppointments = sortedAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderSortIcons = (field) => {
    const active = sortField === field;
    const activeAsc = active && sortDirection === "asc";
    const activeDesc = active && sortDirection === "desc";
    const color = active ? "white" : "#343a40";

    return (
      <span
        className="ms-1 d-inline-flex flex-column"
        style={{
          fontSize: "0.7rem",
          lineHeight: "0.7rem",
          transform: "translateY(-7px)",
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        <span style={{ color, opacity: activeAsc ? 1 : 0.3 }}>▲</span>
        <span style={{ color, opacity: activeDesc ? 1 : 0.3 }}>▼</span>
      </span>
    );
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      onDelete(deleteId);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h4 className="m-0 text-primary fw-bold">Appointments</h4>
          {hasPermission("appointments.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>
              + Add Appointment
            </button>
          )}
        </div>

        <div className="card-body">
          <div className="row mb-3 align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <label className="d-flex align-items-center" style={{ gap: "10px" }}>
                Show
                <select
                  className="form-select form-select-sm"
                  style={{ width: "80px" }}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                entries
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-md-end justify-content-start mt-2 mt-md-0">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ maxWidth: "300px" }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th
                    onClick={() => handleSort("appointment_ID")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    ID {renderSortIcons("appointment_ID")}
                  </th>
                  <th
                    onClick={() => handleSort("prisonerID")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    Prisoner {renderSortIcons("prisonerID")}
                  </th>
                  <th
                    onClick={() => handleSort("medical_staff_ID")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    Medical Staff {renderSortIcons("medical_staff_ID")}
                  </th>
                  <th
                    onClick={() => handleSort("date_")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    Date {renderSortIcons("date_")}
                  </th>
                  {(hasPermission("appointments.edit") || hasPermission("appointments.delete")) && (
                    <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment) => (
                    <tr key={appointment.appointment_ID}>
                      <td>{appointment.appointment_ID}</td>
                      <td>{getPrisonerName(appointment.prisonerID)}</td>
                      <td>{getMedicalStaffName(appointment.medical_staff_ID)}</td>
                      <td>{appointment.date_?.split("T")[0]}</td>

                      {(hasPermission("appointments.edit") || hasPermission("appointments.delete")) && (
                        <td>
                          <div className="d-flex gap-2">
                            {hasPermission("appointments.edit") && (
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => onEdit(appointment)}
                              >
                                Edit
                              </button>
                            )}

                            {hasPermission("appointments.delete") && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setDeleteId(appointment.appointment_ID);
                                  setShowConfirm(true);
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedAppointments.length)} of{" "}
              {sortedAppointments.length} entries
            </div>
            <ul className="pagination mb-0 mt-2 mt-md-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
              </li>
              {pageNumbers.map((num) => (
                <li key={num} className={`page-item ${num === currentPage ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(num)}>
                    {num}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete appointment ID {deleteId}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsList;
