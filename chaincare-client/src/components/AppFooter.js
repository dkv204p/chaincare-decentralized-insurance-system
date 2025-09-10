import React from 'react';
import { Container } from 'react-bootstrap';

const AppFooter = () => {
  // Custom styles to match the dark theme of the AppNavbar
  const footerStyles = {
    backgroundColor: '#111827', // Same dark background as the navbar
    color: '#D1D5DB',          // Softer white text for consistency
    borderTop: '1px solid #374151', // Matching border style
  };

  return (
    <footer className="text-center py-4 mt-auto" style={footerStyles}>
      <Container>
        <p className="mb-0">&copy; 2024 ChainCare. A Decentralized Insurance Platform.</p>
      </Container>
    </footer>
  );
};

export default AppFooter;
