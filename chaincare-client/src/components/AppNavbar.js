import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <path fill="#3B82F6" d="M22,44 C34.1502645,44 44,34.1502645 44,22 C44,9.8497355 34.1502645,0 22,0 C9.8497355,0 0,9.8497355 0,22 C0,34.1502645 9.8497355,44 22,44 Z"></path>
    <path fill="#FFFFFF" d="M22.0000186,13 C16.9838193,13 12.9090186,17.0748 12.9090186,22.0909 C12.9090186,27.107 16.9838193,31.1818 22.0000186,31.1818 C27.0162179,31.1818 31.0910186,27.107 31.0910186,22.0909 C31.0910186,17.0748 27.0162179,13 22.0000186,13 Z M25.5455186,22.4545 L19.8182186,25.9091 L19.8182186,18.2727 L25.5455186,22.4545 Z"></path>
  </svg>
);

// Props: auth, onNavigate, onLogout, currentPage
const AppNavbar = ({ auth, onNavigate, onLogout, currentPage }) => {
  
  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' },
  ];

  // Custom styles to match the image
  const navStyles = {
    backgroundColor: '#111827',
    minHeight: '64px',
    borderBottom: '1px solid #374151',
  };

  const linkStyle = {
    color: '#D1D5DB',
    fontWeight: 500,
  };

  const activeLinkStyle = {
    color: '#3B82F6',
    fontWeight: 600,
  };

  const buttonStyle = {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    fontWeight: 500,
  };

  return (
    <Navbar 
      style={navStyles}
      variant="dark" 
      expand="lg" 
      sticky="top" 
    >
      <Container fluid="xl">
        <Navbar.Brand 
          onClick={() => onNavigate('home')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <Logo />
          <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>ChainCare</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          
          <Nav className="mx-auto">
            {navItems.map((item) => (
              <Nav.Link 
                key={item.page} 
                onClick={() => onNavigate(item.page)} 
                style={currentPage === item.page ? activeLinkStyle : linkStyle}
                className="mx-2"
              >
                {item.name}
              </Nav.Link>
            ))}
            
            {auth && (
              <Nav.Link 
                onClick={() => onNavigate('dashboard')} 
                style={currentPage === 'dashboard' ? activeLinkStyle : linkStyle}
                className="mx-2"
              >
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {!auth ? (
              <Button
                style={buttonStyle}
                onClick={() => onNavigate('login')}
              >
                Login / Register
              </Button>
            ) : (
              <Button
                variant="outline-light"
                onClick={onLogout}
              >
                Logout
              </Button>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
