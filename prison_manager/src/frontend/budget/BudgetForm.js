import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const BudgetForm = ({ showModal, handleClose, form, isEditing, handleInputChange, handleSubmit }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Budget" : "Create Budget"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="allocated_funds"
              placeholder="Allocated funds"
              value={form.allocated_funds}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="used_funds"
              placeholder="Used funds"
              value={form.used_funds}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="datetime-local"
              name="last_updated"
              placeholder="Last updated"
              value={form.last_updated}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant={isEditing ? "warning" : "primary"} type="submit" className="ms-2">
              {isEditing ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BudgetForm;
