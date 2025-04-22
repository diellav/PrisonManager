import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CellForm = ({ showModal, handleClose, form, isEditing, handleInputChange, handleSubmit }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Cell Block" : "Create Cell Block"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="block_name"
              placeholder="Block Name (e.g., A, B)"
              value={form.block_name}
              onChange={handleInputChange}
              maxLength={1}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="actual_capacity"
              placeholder="Actual Capacity"
              value={form.actual_capacity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant={isEditing ? "warning" : "primary"} type="submit" className="ms-2">
            {isEditing ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CellForm;
