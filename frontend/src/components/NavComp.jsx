import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
function NavComp() {
  return (
    <Navbar data-bs-theme="dark" className='w-screen hover:bg-gray-800'>
        <Container>
          <Navbar.Brand href="#home">HomeBoiii</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">About Us</Nav.Link>
            <Nav.Link href="#pricing">Contact Us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}

export default NavComp