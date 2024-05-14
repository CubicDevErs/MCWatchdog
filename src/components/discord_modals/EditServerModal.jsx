import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditServerModal = ({
  showEditModal,
  handleClose,
  formData,
  handleInputChange,
  handleSubmitEdit,
  setShowEditModal,
}) => {
  return (
    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>Edit Server</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "white" }}>
        <Form onSubmit={handleSubmitEdit}>
          <Form.Group controlId="editServerName">
            <Form.Label>Server Name</Form.Label>
            <Form.Control
              type="text"
              name="serverName"
              value={formData.serverName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="editServerAddress">
            <Form.Label>Server Address</Form.Label>
            <Form.Control
              type="text"
              name="serverAddress"
              value={formData.serverAddress}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="editServerPort">
            <Form.Label>Server Port</Form.Label>
            <Form.Control
              type="text"
              name="serverPort"
              value={formData.serverPort}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="editServerPlatform">
            <Form.Label>Server Platform</Form.Label>
            <Form.Control
              as="select"
              name="serverPlatform"
              value={formData.serverPlatform}
              onChange={handleInputChange}
              required
            >
              <option value="java">Java</option>
              <option value="bedrock">Bedrock</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editServerFavicon">
            <Form.Label>Server Favicon</Form.Label>
            <Form.Control
              type="text"
              name="serverFavicon"
              value={formData.serverFavicon}
              onChange={handleInputChange}
              placeholder="https://packpng.com/static/pack.png"
              required
            />
          </Form.Group>
          <Form.Group controlId="editEnableNotifications">
            <Form.Label>Enable Notifications</Form.Label>
            <Form.Control
              as="select"
              name="enableNotifications"
              value={formData.enableNotifications}
              onChange={handleInputChange}
              required
            >
              <option value={true}>Enable</option>
              <option value={false}>Disable</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Edit Server
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditServerModal;