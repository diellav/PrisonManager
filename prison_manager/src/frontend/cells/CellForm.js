import React from "react";

const CellForm = ({
  form,
  blocks,
  isEditing,
  handleInputChange,
  handleSubmit,
  onCancel,
}) => {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit Cell Block" : "Create Cell Block"}
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Block</label>
              <select
                name="block_id"
                className="form-control"
                value={form.block_id || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Block</option>
                {blocks.map((block) => (
                  <option key={block.block_id} value={block.block_id}>
                    {block.block_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Cell Number</label>
              <input
                type="text"
                className="form-control"
                name="cell_number"
                value={form.cell_number}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-control"
                name="capacity"
                value={form.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Actual Capacity</label>
              <input
                type="number"
                className="form-control"
                name="actual_capacity"
                value={form.actual_capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={form.category}
                disabled
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CellForm;
