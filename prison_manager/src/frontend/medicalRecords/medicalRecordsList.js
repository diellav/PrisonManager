import React, { useState } from "react";

const MedicalRecordsList = ({
  records = [],
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
  const [sortField, setSortField] = useState("medical_record_ID");
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

  const filteredRecords = records.filter((record) => {
    const prisonerName = getPrisonerName(record.prisonerID).toLowerCase();
    const staffName = getMedicalStaffName(record.medical_staff_ID).toLowerCase();
    const diagnosis = record.diagnosis?.toLowerCase() || "";
    const treatment = record.treatment?.toLowerCase() || "";
    const medications = record.medications?.toLowerCase() || "";

    return (
      prisonerName.includes(searchTerm.toLowerCase()) ||
      staffName.includes(searchTerm.toLowerCase()) ||
      diagnosis.includes(searchTerm.toLowerCase()) ||
      treatment.includes(searchTerm.toLowerCase()) ||
      medications.includes(searchTerm.toLowerCase()) ||
      String(record.medical_record_ID).includes(searchTerm)
    );
  });

  const sortedRecords = filteredRecords.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
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
        }}
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
          <h4 className="m-0 text-primary fw-bold">Medical Records List</h4>
          {hasPermission("medical_records.create") && (
            <button className="btn btn-primary" onClick={goToCreate}>
              + Add Record
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
                    onClick={() => handleSort("medical_record_ID")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    ID {renderSortIcons("medical_record_ID")}
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
                    onClick={() => handleSort("diagnosis")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    Diagnosis {renderSortIcons("diagnosis")}
                  </th>
                  <th
                    onClick={() => handleSort("treatment")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    Treatment {renderSortIcons("treatment")}
                  </th>
                  <th
                    onClick={() => handleSort("medications")}
                    style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                  >
                    Medications {renderSortIcons("medications")}
                  </th>
                  {(hasPermission("medical_records.edit") || hasPermission("medical_records.delete")) && (
                    <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <tr key={record.medical_record_ID}>
                      <td>{record.medical_record_ID}</td>
                      <td>{getPrisonerName(record.prisonerID)}</td>
                      <td>{getMedicalStaffName(record.medical_staff_ID)}</td>
                      <td>{record.diagnosis}</td>
                      <td>{record.treatment}</td>
                      <td>{record.medications || "-"}</td>
                      {(hasPermission("medical_records.edit") || hasPermission("medical_records.delete")) && (
                        <td>
                          <div className="d-flex gap-2">
                            {hasPermission("medical_records.edit") && (
                              <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(record)}>
                                Edit
                              </button>
                            )}
                            {hasPermission("medical_records.delete") && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setShowConfirm(true);
                                  setDeleteId(record.medical_record_ID);
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
                    <td colSpan="7" className="text-center">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
  <div className="small text-muted mb-2 mb-md-0">
    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedRecords.length)} of {sortedRecords.length} entries
  </div>
  <ul className="pagination mb-0 mt-2 mt-md-0">
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      >
        Prev
      </button>
    </li>
    {pageNumbers.map((number) => (
      <li
        key={number}
        className={`page-item ${currentPage === number ? "active" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </button>
      </li>
    ))}
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">Are you sure you want to delete this medical record?</div>
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

export default MedicalRecordsList;
