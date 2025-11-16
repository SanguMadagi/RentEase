import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './Auth/LogoutButton';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          🏠 RentEase
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
                 <Nav className="me-auto">
                   <Nav.Link as={Link} to="/">
                     Products
                   </Nav.Link>
                   {isAuthenticated && (
                     <>
                       <Nav.Link as={Link} to="/add-product">
                         Add Product
                       </Nav.Link>
                       <Nav.Link as={Link} to="/chatbot">
                         🤖 AI Assistant
                       </Nav.Link>
                     </>
                   )}
                 </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <LogoutButton className="ms-2" />
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

