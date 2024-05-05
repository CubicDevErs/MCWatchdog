import React, { useEffect } from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";

const host = "https://backend.mcwatchdog.com";

const UpgradeAccountModal = ({ showModal, handleClose }) => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleSubscription = async (priceId) => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      if (!storedUser || storedUser.email === "undefined") {
        navigate("/dashboard");
        return;
      }

      const email = storedUser.email;

      const response = await fetch(
        `${host}/payment/create-checkout-session/${email}/${priceId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location = url;
    } catch (error) {
      console.error(error);
    }
  };

  const renderSubscriptionCard = (title, description, price, priceId) => {
    return (
      <Col>
        <Card className="info-block">
          <Card.Body>
            <Card.Title style={{ color: "white" }}>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Text>Price: ${price} /month</Card.Text>
            <Button
              variant="secondary"
              onClick={() => handleSubscription(priceId)}
            >
              Subscribe
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>
          Select your subscription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalblock">
        <Row xs={1} md={2} className="g-4">
          {renderSubscriptionCard(
            "Server Tier",
            "You can have up to 5 server trackers with each its own push notification.",
            2.5,
            "price_1P9dv4FQiXzTDa0RC6F37GnK"
          )}
          {renderSubscriptionCard(
            "Discord Tier",
            "You can have up to 5 Discord trackers with each its own DM notification.",
            2.5,
            "price_1P9dv2FQiXzTDa0RtviuEUh9"
          )}
          {renderSubscriptionCard(
            "MCWatchdog Tier",
            "Server Tier and Discord Tier combined.",
            4.0,
            "price_1P9cxCFQiXzTDa0RE1pimrDU"
          )}
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

export default UpgradeAccountModal;
