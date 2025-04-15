import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UserForm = ({ showModal, handleClose, form, isEditing, handleInputChange, handleSubmit }) => {
  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit User" : "Create User"}</Modal.Title>
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
            <Form.Select
              name="gender"
              value={form.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Phone"
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

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password_"
              placeholder="Password"
              value={form.password_}
              onChange={handleInputChange}
              required={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="photo"
              placeholder="Photo URL"
              value={form.photo}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select
              name="roleID"
              value={form.roleID}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="1">Admin</option>
              <option value="2">Guard</option>
              <option value="3">Warden</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant={isEditing ? "warning" : "primary"} type="submit" className="ms-2">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserForm;
