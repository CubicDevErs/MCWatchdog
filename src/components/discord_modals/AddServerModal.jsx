import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddServerModal = ({
  showModal,
  handleClose,
  formData,
  handleInputChange,
  handleSubmit,
  setShowModal,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>Add Server</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "white" }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="serverName">
            <Form.Label>Server Name</Form.Label>
            <Form.Control
              type="text"
              name="serverName"
              value={formData.serverName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="serverAddress">
            <Form.Label>Server Address</Form.Label>
            <Form.Control
              type="text"
              name="serverAddress"
              value={formData.serverAddress}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="serverPort">
            <Form.Label>Server Port</Form.Label>
            <Form.Control
              type="text"
              name="serverPort"
              value={formData.serverPort}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="serverPlatform">
            <Form.Label>Server Platform</Form.Label>
            <Form.Control
              as="select"
              name="serverPlatform"
              value={formData.serverPlatform}
              onChange={handleInputChange}
            >
              <option value="java">Java</option>
              <option value="bedrock">Bedrock</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="serverFavicon">
            <Form.Label>Server Favicon</Form.Label>
            <Form.Control
              type="text"
              name="serverFavicon"
              value={formData.serverFavicon}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="enableNotifications">
            <Form.Label>Enable Notifications</Form.Label>
            <Form.Control
              as="select"
              name="enableNotifications"
              value={formData.enableNotifications}
              onChange={handleInputChange}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Server
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddServerModal;