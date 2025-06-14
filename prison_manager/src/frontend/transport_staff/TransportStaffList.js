  import React, { useState } from "react";

  const TransportStaffList = ({
    staff,
    onEdit,
    users = [],
  }) => {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    const hasPermission = (perm) => permissions.includes(perm.toLowerCase());

    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("transport_staff_ID");
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

    const handleItemsPerPageChange = (e) => {
      setItemsPerPage(parseInt(e.target.value));
      setCurrentPage(1);
    };

    const renderSortIcons = (field) => {
      const active = sortField === field;
      const activeAsc = active && sortDirection === "asc";
      const activeDesc = active && sortDirection === "desc";
      const color = active ? "white" : "#343a40";

      return (
        <span
          className="ms-1 d-inline-flex flex-column"
          style={{ fontSize: "0.7rem", lineHeight: "0.7rem", transform: "translateY(-7px)" }}
        >
          <span style={{ color, opacity: activeAsc ? 1 : 0.3 }}>▲</span>
          <span style={{ color, opacity: activeDesc ? 1 : 0.3 }}>▼</span>
        </span>
      );
    };

const filteredStaff = [...staff]
  .filter((s) => {
    const user = users.find((u) => u.userID === s.userID);
    const userName = user ? `${user.first_name} ${user.last_name}` : "";
    return (
      String(s.transport_staff_ID).toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.transport_role).toLowerCase().includes(searchTerm.toLowerCase())
    );
  })
  .sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "first_name") {
      const aUser = users.find((u) => u.userID === a.userID);
      const bUser = users.find((u) => u.userID === b.userID);

      aVal = aUser ? `${aUser.first_name} ${aUser.last_name}`.toLowerCase() : "";
      bVal = bUser ? `${bUser.first_name} ${bUser.last_name}`.toLowerCase() : "";
    }

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });


    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentStaff = filteredStaff.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="card shadow-sm mb-4 border-0">
        <div
          className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom"
          style={{ backgroundColor: "#4E73DF" }}
        >
          <h4 className="m-0 text-primary fw-bold">Transport Staff List</h4>
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
                  {[ 
                    { label: "ID", field: "transport_staff_ID" },
                    { label: "Staff name", field: "first_name" },
                    { label: "Role", field: "transport_role" },
                  ].map(({ label, field }) => (
                    <th
                      key={field}
                      style={{ cursor: "pointer", backgroundColor: "#4E73DF", color: "white" }}
                      onClick={() => handleSort(field)}
                    >
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                  {(hasPermission("transport_staff.edit") || hasPermission("transport_staff.delete")) && (
                    <th style={{ backgroundColor: "#4E73DF", color: "white" }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentStaff.length > 0 ? (
                  currentStaff.map((s) => {
                    const user = users.find((u) => u.userID === s.userID);
                    const userName = user ? `${user.first_name} ${user.last_name}` : s.userID;

                    return (
                      <tr key={s.transport_staff_ID}>
                        <td>{s.transport_staff_ID}</td>
                        <td>{userName}</td>
                        <td>{s.transport_role}</td>
                        {(hasPermission("transport_staff.edit") || hasPermission("transport_staff.delete")) && (
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {hasPermission("transport_staff.edit") && (
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => onEdit(s)}
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="100%" className="text-center">
                      No transport staff found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filteredStaff.length)} of{" "}
              {filteredStaff.length} entries
            </div>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </button>
              </li>
              {pageNumbers.map((num) => (
                <li
                  key={num}
                  className={`page-item ${num === currentPage ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  export default TransportStaffList;
