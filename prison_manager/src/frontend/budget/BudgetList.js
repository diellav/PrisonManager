import React from "react";

const BudgetList = ({ budgets, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
     <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold text-primary">Budget List</h4>
          <button className="btn btn-success" onClick={goToCreate}>
            + Create New Budget
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Year</th>
            <th>Allocated Funds</th>
            <th>Used Funds</th>
            <th>Remaining Funds</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.budget_ID}>
              <td>{budget.budget_ID}</td>
              <td>{budget.year_}</td>
              <td>{budget.allocated_funds}</td>
              <td>{budget.used_funds}</td>
              <td>{budget.remaining_funds}</td>
              <td>{new Date(budget.last_updated).toLocaleString()}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(budget)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(budget.budget_ID)}>
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

export default BudgetList;
