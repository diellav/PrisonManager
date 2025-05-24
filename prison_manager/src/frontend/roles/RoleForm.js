import React, { useState, useEffect } from "react";
const RoleForm = ({
  form,
  setForm,
  isEditing,
  permissions,
  handleSubmit,
  handleClose,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  const groupedPermissions = permissions.reduce((acc, perm) => {
    const [entity, action] = perm.name.split(".");
    if (!acc[entity]) acc[entity] = {};
    acc[entity][action] = perm;
    return acc;
  }, {});

  const handlePermissionToggle = (permissionID) => {
    setForm((prev) => {
      const updated = prev.permissionIDs.includes(permissionID)
        ? prev.permissionIDs.filter((id) => id !== permissionID)
        : [...prev.permissionIDs, permissionID];
      return { ...prev, permissionIDs: updated };
    });
  };

  const validatePermissions = () => {
    const invalidEntities = [];

    Object.entries(groupedPermissions).forEach(([entity, actions]) => {
      const hasEdit = actions.edit && form.permissionIDs.includes(actions.edit.permissionID);
      const hasDelete = actions.delete && form.permissionIDs.includes(actions.delete.permissionID);
      const hasRead = actions.read && form.permissionIDs.includes(actions.read.permissionID);

      if ((hasEdit || hasDelete) && !hasRead) {
        invalidEntities.push(entity);
      }
    });

    if (invalidEntities.length > 0) {
      setConfirmMessage(
        `For these entities, "read" permission is required if "edit" or "delete" is selected: ${invalidEntities.join(", ")}`
      );
      setShowConfirm(true);
      return false;
    }
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validatePermissions()) {
      handleSubmit(e);
    }
  };

  return (
    <>
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">{isEditing ? "Edit Role" : "Create Role"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Role Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Permissions</label>
              <div className="row">
                {Object.entries(groupedPermissions).map(([entity, actions]) => (
                  <div className="col-md-6 mb-3" key={entity}>
                    <strong className="d-block mb-1 text-capitalize">{entity}</strong>
                    <div className="d-flex flex-wrap">
                      {["create", "read", "edit", "delete"].map((action) => {
                        const perm = actions[action];
                        return perm ? (
                          <div
                            key={perm.permissionID}
                            className="form-check me-3"
                            style={{ marginRight: "20px" }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`perm-${perm.permissionID}`}
                              checked={form.permissionIDs.includes(perm.permissionID)}
                              onChange={() => handlePermissionToggle(perm.permissionID)}
                            />
                            <label
                              className="form-check-label text-capitalize"
                              htmlFor={`perm-${perm.permissionID}`}
                            >
                              {action}
                            </label>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? "Update Role" : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirm && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Validation Error</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{confirmMessage}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowConfirm(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RoleForm;