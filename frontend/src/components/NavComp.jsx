import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logo from "../assets/solis.png"; // Correctly import the logo
import { ArrowUpRight } from "react-bootstrap-icons"; // Bootstrap icon for top-right arrow

function NavComp() {
  return (
    <Navbar expand="lg" data-bs-theme="dark" className="w-screen"style={{ zIndex: 1000 }}>
      <Container>
        {/* Logo on the Far Left */}
        <Navbar.Brand href="#home">
          <img 
            src={logo} 
            alt="Solis Logo" 
            className="h-12 w-12 sm:h-20 sm:w-20 rounded-full object-cover bg-transparent"
          />
        </Navbar.Brand>

        {/* Toggle Button for Smaller Screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        {/* Collapsible Navigation Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto space-x-4 sm:space-x-10 text-base sm:text-xl">
            <Nav.Link href="#home" className="text-white font-medium" style={{ textDecoration: "none" }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
              Home
            </Nav.Link>
            <Nav.Link href="#about" className="text-white font-medium" style={{ textDecoration: "none" }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
              About Us
            </Nav.Link>
            <Nav.Link href="#contact" className="text-white font-medium" style={{ textDecoration: "none" }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
              Contact Us
            </Nav.Link>
          </Nav>

          {/* Download Extension Button on the Far Right */}
          <Button variant="outline-light" className="d-flex align-items-center gap-2 text-sm sm:text-base">
            Download Extension
            <ArrowUpRight size={16} />
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavComp;
