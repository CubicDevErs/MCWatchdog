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
      <Container>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-dark"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: "white" }}>
              Home
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard" style={{ color: "white" }}>
                  Dashboard
                </Nav.Link>
              </>
            )}
          </Nav>
          {user && user.displayName && (
            <>
              <Navbar.Text className="me-3" style={{ color: "white" }}>
                Signed in as: {user.displayName}
              </Navbar.Text>
            </>
          )}
          {!user && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={handleLogin}
                style={{ color: "white" }}
              >
                Login
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}