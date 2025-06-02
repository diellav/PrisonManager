import React, { useState } from "react";

const MedicalStaffList = ({ staffList, onEdit, onDelete, goToCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("medical_staff_ID");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const filtered = [...staffList]
    .filter((staff) =>
      Object.values(staff).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStaff = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const renderSortIcons = (field) => {
    const active = sortField === field;
    return (
      <span className="ms-1 d-inline-flex flex-column" style={{ fontSize: "0.7rem", lineHeight: "0.7rem" }}>
        <span style={{ color: active && sortDirection === "asc" ? "white" : "#ccc", opacity: active ? 1 : 0.4 }}>▲</span>
        <span style={{ color: active && sortDirection === "desc" ? "white" : "#ccc", opacity: active ? 1 : 0.4 }}>▼</span>
      </span>
    );
  };

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
        <h4 className="m-0 text-primary fw-bold">Medical Staff List</h4>
        <button className="btn btn-primary" onClick={goToCreate}>+ Add Medical Staff</button>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="d-flex align-items-center gap-2">
              <label>Show</label>
              <select
                className="form-select form-select-sm"
                style={{ width: "80px" }}
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <label>entries</label>
            </div>
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
            <thead style={{ backgroundColor: "#4E73DF", color: "white" }}>
              <tr>
                <th onClick={() => handleSort("medical_staff_ID")} style={{ cursor: "pointer" }}>
                  ID {renderSortIcons("medical_staff_ID")}
                </th>
                <th onClick={() => handleSort("userID")} style={{ cursor: "pointer" }}>
                  User ID {renderSortIcons("userID")}
                </th>
                <th onClick={() => handleSort("specialty")} style={{ cursor: "pointer" }}>
                  Specialty {renderSortIcons("specialty")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStaff.length > 0 ? (
                currentStaff.map((staff) => (
                  <tr key={staff.medical_staff_ID}>
                    <td>{staff.medical_staff_ID}</td>
                    <td>{staff.userID}</td>
                    <td>{staff.specialty}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-info" onClick={() => onEdit(staff)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(staff.medical_staff_ID)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="mb-2 mb-md-0">
              Showing {filtered.length === 0 ? 0 : indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
            </div>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`btn btn-sm mx-1 ${number === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalStaffList;
