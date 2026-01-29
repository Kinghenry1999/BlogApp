import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const AppNavbar = () => {
  return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      style={{ padding: "12px 0" }}
    >
      <Container>
        <Navbar.Brand href="#">
          MyBlog
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#" style={{ marginRight: "10px" }}>
              Home
            </Nav.Link>
            <Nav.Link href="#" style={{ marginRight: "10px" }}>
              About
            </Nav.Link>
            <Nav.Link href="#">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
