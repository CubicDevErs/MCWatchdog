import React, { useState } from "react";
import { Modal, Button, Card, Row, Col, Dropdown } from "react-bootstrap";

const GuideModal = ({ showModal, handleClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      label: "How to setup server tracker", content: (
        <>
          <ol>
            <li className="text-white mb-3">Navigate to Server Tracker and click on "Add Server".</li>
            <li className="text-white mb-3">For a single Minecraft server, you can use your domain/IP + port. We also support query ping port.</li>
            <li className="text-white mb-3">For proxy setups, we recommend opening the query port. With this, you can track all your backend servers.</li>
            <li className="text-white mb-3">Our system will automatically push a notification to all clients where mcwatchdog was opened. To deactivate notifications, you can simply disable them in your browser or app settings.</li>
          </ol>
        </>
      )
    },
    {
      label: "How to setup Discord tracker", content: (
        <>
          <ol>
            <li className="text-white mb-3">Login to MCWatchdog and click "Link Discord".
            </li>
            <li className="text-white mb-3">Link your Discord account to MCWatchdog. Use{" "}
              <code>/link</code> if you've already invited the bot.</li>
            <li className="text-white mb-3">Invite our bot to your server.</li>
            <li className="text-white mb-3">Add your server in the Guild section.</li>
            <li className="text-white mb-3">Enable Discord status for your server in the actions menu.</li>
            <li className="text-white mb-3">Submit and wait up to 5 minutes for the status to update in the designated channel.</li>
          </ol>
        </>
      )
    },
  ];

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>How to setup server status trackers</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalblock">
        <Row className="justify-content-center">
          <Col sm={8}>
            <Dropdown>
              <Dropdown.Toggle className="mb-2 custom-button" id="dropdown-basic">
                {selectedOption !== null ? options[selectedOption].label : "Select an option"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {options.map((option, index) => (
                  <Dropdown.Item key={index} onClick={() => handleOptionSelect(index)}>
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {selectedOption !== null && (
              <Card className="info-block text-start mt-3">
                <Card.Body>
                  <Card.Title className="text-white" style={{ textAlign: "center" }}>
                    {options[selectedOption].label}
                  </Card.Title>
                  <Card.Text as="div" style={{ paddingTop: "20px" }}>                    {options[selectedOption].content}
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GuideModal;

