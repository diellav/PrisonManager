import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RoleForm = ({ showModal, handleClose, form, setForm, handleSubmit, isEditing, permissions }) => {

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (typeof perm.name !== "string") {
      console.warn("Invalid permission name:", perm.name);
      return acc;
    }
    const [entity, action] = perm.name.split(".");
    if (!acc[entity]) acc[entity] = {};
    acc[entity][action] = perm;
    return acc;
  }, {});

  const handlePermissionToggle = (permissionID) => {
    const updatedPermissionIDs = form.permissionIDs.includes(permissionID)
      ? form.permissionIDs.filter((id) => id !== permissionID)
      : [...form.permissionIDs, permissionID];

    setForm({
      ...form,
      permissionIDs: updatedPermissionIDs,
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
      alert(`For the following entities, you must also select "read" if you select "edit" or "delete": ${invalidEntities.join(", ")}`);
      return false;
    }

    return true;
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Role" : "Create Role"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => {
          e.preventDefault();
          if (validatePermissions()) {
            handleSubmit(e);
          }
        }}>
          {}
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              type="text"
              name="name"
              placeholder="Role Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Form.Group>

          {}
          <Form.Group className="mb-3" controlId="description">
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Form.Group>

          <hr />

          {}
          <Form.Group className="mb-3">
            <Form.Label><strong>Select Permissions:</strong></Form.Label>
            <div>
              {Object.entries(groupedPermissions).map(([entity, actions]) => (
                <div key={entity} className="mb-3">
                  <strong>{entity.charAt(0).toUpperCase() + entity.slice(1)}:</strong>
                  <div className="d-flex flex-wrap mt-1">
                    {["create", "read", "edit", "delete"].map((action) => {
                      const perm = actions[action];
                      return perm ? (
                        <Form.Check
                          inline
                          key={perm.permissionID}
                          type="checkbox"
                          id={perm.permissionID}
                          label={action.charAt(0).toUpperCase() + action.slice(1)}
                          checked={form.permissionIDs.includes(perm.permissionID)}
                          onChange={() => handlePermissionToggle(perm.permissionID)}
                          className="me-3"
                        />
                      ) : (
                        <div key={`${entity}-${action}`} className="me-3 text-muted" style={{ minWidth: "75px" }} />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Form.Group>

          {}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              {isEditing ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RoleForm;
