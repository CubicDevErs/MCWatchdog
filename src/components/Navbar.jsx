import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaPalette } from "react-icons/fa";

export default function CustomNavbar({ user }) {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      updateTheme(savedTheme);
    }
  }, []);

  function handleLogin() {
    navigate("/login");
  }

  function changeTheme(theme) {
    setSelectedTheme(theme);
    updateTheme(theme);
    localStorage.setItem("selectedTheme", theme);
  }

  function updateTheme(theme) {
    const root = document.documentElement;
    switch (theme) {
      case "red":
        root.style.setProperty("--background-gradient", "linear-gradient(to bottom, rgb(61, 7, 7), rgb(24, 14, 14))");
        break;
      case "blue":
        root.style.setProperty("--background-gradient", "linear-gradient(to bottom, rgb(7, 11, 61), rgb(13, 10, 40))");
        break;
      case "green":
        root.style.setProperty("--background-gradient", "linear-gradient(to bottom, rgb(7, 61, 19), rgb(18, 28, 13))");
        break;
      case "cyaan":
        root.style.setProperty("--background-gradient", "linear-gradient(to bottom, rgb(7, 60, 61), rgb(10, 35, 40))");
        break;
      case "olive":
        root.style.setProperty("--background-gradient", "linear-gradient(to bottom, rgb(41, 55, 3), rgb(25, 25, 7))");
        break;
      case "pink":
        root.style.setProperty("--background-gradient", "linear-gradient(to bottom, rgb(169, 27, 145), rgb(43, 10, 36))");
        break;
      default:
        root.style.setProperty("--background-gradient", "linear-gradient(to bottom, rgb(61, 7, 7), rgb(24, 14, 14))");
        break;
    }
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
            <Nav.Link as={Link} to="https://discord.gg/3kmNFjFmew" style={{ color: "white" }}>
              Discord
            </Nav.Link>
            {!user && (
              <Nav.Link as="button" onClick={handleLogin} style={{ color: "white", border: "none", background: "none", padding: 0, marginLeft: "auto" }}>
                Login
              </Nav.Link>
            )}
          </Nav>
          <div>
            <Dropdown show={dropdownOpen} onToggle={(isOpen) => setDropdownOpen(isOpen)}>
              <Dropdown.Toggle className="custom-button" id="dropdown-basic">
                <FaPalette />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeTheme("red")} active={selectedTheme === "red"}>
                  Red
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeTheme("blue")} active={selectedTheme === "blue"}>
                  Blue
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeTheme("green")} active={selectedTheme === "green"}>
                  Green
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeTheme("cyaan")} active={selectedTheme === "cyaan"}>
                  Cyaan
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeTheme("olive")} active={selectedTheme === "olive"}>
                  Olive
                </Dropdown.Item>
                <Dropdown.Item onClick={() => changeTheme("pink")} active={selectedTheme === "pink"}>
                  Pink
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
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
