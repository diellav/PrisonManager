import React, { useState } from "react";
const VisitsList = ({ visits }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("visit_ID");
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

  const filteredVisits = visits
    .filter((visit) =>
      Object.values(visit).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVisits = filteredVisits.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h4 className="m-0 text-primary fw-bold">Approved Visits List</h4>
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
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
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
                    { field: "visit_ID", label: "Visit ID" },
                    { field: "visitor_name", label: "Visitor Name" },
                    { field: "prisoner_name", label: "Prisoner Name" },
                    { field: "relationship", label: "Relationship" },
                    { field: "visit_date", label: "Date" },
                    ].map(({ field, label }) => (
                    <th
                      key={field}
                      style={{
                        cursor: "pointer",
                        color: "white",
                        backgroundColor: "#4E73DF",
                      }}
                      onClick={() => handleSort(field)}
                    >
                      {label} {renderSortIcons(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentVisits.length > 0 ? (
                  currentVisits.map((visit) => (
                    <tr key={visit.visit_ID}>
                        <td>{visit.visit_ID}</td>
                        <td>{visit.visitor_name}</td>
                        <td>{visit.prisoner_name}</td>
                        <td>{visit.relationship || "N/A"}</td>
                        <td>{new Date(visit.visit_date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      No visits found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="small text-muted mb-2 mb-md-0">
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredVisits.length)} of{" "}
              {filteredVisits.length} entries
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
                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(number)}>
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
    </div>
  );
};

export default VisitsList;
