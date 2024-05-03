import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EnableStatusModal = ({
  showEnableStatusModal,
  handleClose,
  formData,
  handleDiscordChannelSelect,
  handleEnableStatusSubmit,
  discordChannels,
  setShowEnableStatusModal,
}) => {
  return (
    <Modal
      show={showEnableStatusModal}
      onHide={() => setShowEnableStatusModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>
          Enable Discord Status
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "white" }}>
        <Form onSubmit={handleEnableStatusSubmit}>
          <Form.Group controlId="discordChannel">
            <Form.Label>Select Discord Channel</Form.Label>
            <Form.Control
              as="select"
              name="discordChannel"
              value={formData.discordChannel}
              onChange={handleDiscordChannelSelect}
            >
              <option value="">Select a channel</option>
              {discordChannels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Enable Status
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EnableStatusModal;