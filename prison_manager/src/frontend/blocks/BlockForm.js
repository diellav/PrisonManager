import React from "react";

const BlockForm = ({ form, isEditing, handleInputChange, handleSubmit, handleClose }) => {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h4 className="m-0 font-weight-bold text-primary">
          {isEditing ? "Edit Block" : "Create Block"}
        </h4>
      </div>
      <div className="card-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Block Name</label>
              <input
                type="text"
                className="form-control"
                name="block_name"
                value={form.block_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleClose}
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

export default BlockForm;
