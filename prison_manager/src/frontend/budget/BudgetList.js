import React from "react";

const BudgetList = ({ budgets, onEdit, onDelete, goToCreate }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Budget List</h2>
        <button className="btn btn-success" onClick={goToCreate}>+ Add new budget</button>
      </div>

      <table className="table table-striped table-bordered">
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
  );
};

export default BudgetList;
