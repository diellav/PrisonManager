import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EmergencyContactForm = ({ showModal, handleClose, form, isEditing, handleInputChange, handleSubmit }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Emergency Contact" : "Create Emergency Contact"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="date"
              name="date_of_birth"
              placeholder="Date of Birth"
              value={form.date_of_birth}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="gender"
              placeholder="Gender"
              value={form.gender}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="address_"
              placeholder="Address"
              value={form.address_}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
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

export default EmergencyContactForm;
