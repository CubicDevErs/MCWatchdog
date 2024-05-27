import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CustomNavbar({ user }) {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/login");
  }

  return (
    <Navbar expand="lg" style={{ color: "white" }}>
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-dark" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto w-100 flex-column flex-lg-row">
            <Nav.Link as={Link} to="/" style={{ color: "white" }}>
              Home
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/dashboard" style={{ color: "white" }}>
                Dashboard
              </Nav.Link>
            )}
            {!user && (
              <Button
                variant="success"
                size="sm"
                onClick={handleLogin}
                style={{ color: "white" }}
              >
                Login
              </Button>
            )}
          </Nav>
          {user && user.displayName && (
            <div className="ml-auto">
              <Navbar.Text className="me-3" style={{ color: "white" }}>
                Signed in as: {user.displayName}
              </Navbar.Text>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
