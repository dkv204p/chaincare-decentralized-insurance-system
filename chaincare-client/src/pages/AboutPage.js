import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutPage = () => {
  // Styles to match the dark theme
  const pageStyles = {
    backgroundColor: '#111827', // Dark background
    color: '#D1D5DB',          // Light text
    minHeight: 'calc(100vh - 128px)', // Adjust based on navbar/footer height
    display: 'flex',
    alignItems: 'center',
  };

  const headingStyles = {
    color: '#FFFFFF', // White heading for emphasis
  };

  return (
    <div style={pageStyles}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="mb-4" style={headingStyles}>About ChainCare</h2>
            <p>The insurance industry has long been plagued by inefficiencies, lack of transparency, and fraudulent activities. To address these challenges, we present ChainCare, a decentralized insurance platform built on blockchain technology. ChainCare leverages Ethereum smart contracts to automate policy creation, claims processing, and payments, ensuring transparency, security, and efficiency.</p>
            <p>Our mission is to create a more user-centric insurance system where policyholders are in control. By eliminating intermediaries, we reduce operational costs and enable direct, trustworthy interactions between insurers and policyholders.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
