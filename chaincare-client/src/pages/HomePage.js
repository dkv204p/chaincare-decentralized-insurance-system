import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const HomePage = ({ onNavigate }) => {
  // --- STYLES FOR DARK THEME ---
  const pageStyles = {
    backgroundColor: '#111827',
    color: '#D1D5DB',
  };

  const heroSectionStyles = {
    backgroundColor: '#1F2937', // A slightly lighter dark for the hero
    padding: '4rem 0',
  };
  
  const featuresSectionStyles = {
      backgroundColor: '#111827',
      padding: '4rem 0',
  };
  
  const howItWorksSectionStyles = {
      backgroundColor: '#1F2937',
      padding: '4rem 0',
  };

  const headingStyles = {
    color: '#FFFFFF',
  };

  const subHeadingStyles = {
    color: '#9CA3AF',
  };
  
  const cardStyles = {
    backgroundColor: '#111827',
    color: '#D1D5DB',
    border: '1px solid #374151',
    height: '100%',
  };

  const primaryButtonStyle = {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    fontWeight: 500,
    padding: '0.75rem 1.5rem',
    fontSize: '1.25rem',
  };

  return (
    <div style={pageStyles}>
      {/* Hero Section */}
      <div className="text-center" style={heroSectionStyles}>
        <Container>
          <h1 className="display-4 fw-bold" style={headingStyles}>The Future of Insurance is Here.</h1>
          <p className="fs-4" style={subHeadingStyles}>Transparent, Secure, and Efficient insurance powered by Blockchain.</p>
          <Button style={primaryButtonStyle} onClick={() => onNavigate('login')}>Get Started</Button>
        </Container>
      </div>

      {/* Features Section */}
      <div style={featuresSectionStyles}>
        <Container>
          <h2 className="text-center mb-5" style={headingStyles}>Why Choose ChainCare?</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <Card style={cardStyles}>
                <Card.Body>
                  <Card.Title style={headingStyles}>⛓️ Unbreakable Security</Card.Title>
                  <Card.Text>Leveraging blockchain's immutability, your policy data is tamper-proof and secure.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-4">
              <Card style={cardStyles}>
                <Card.Body>
                  <Card.Title style={headingStyles}>⚡ Faster Claims</Card.Title>
                  <Card.Text>Automated claim processing via smart contracts means you get paid faster, without hassle.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-4">
              <Card style={cardStyles}>
                <Card.Body>
                  <Card.Title style={headingStyles}>💰 Lower Costs</Card.Title>
                  <Card.Text>By removing intermediaries, we reduce operational costs and pass the savings to you.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* How It Works Section */}
      <div style={howItWorksSectionStyles}>
          <Container>
            <h2 className="text-center mb-5" style={headingStyles}>How It Works</h2>
            <Row className="align-items-center">
                <Col md={4} className="text-center p-3">
                    <h5 style={headingStyles}>1. Register & Connect</h5>
                    <p>Create an account and securely connect your Ethereum wallet.</p>
                </Col>
                <Col md={4} className="text-center p-3">
                    <h5 style={headingStyles}>2. Get a Policy</h5>
                    <p>Our admin creates a policy for you, recorded transparently on the blockchain.</p>
                </Col>
                <Col md={4} className="text-center p-3">
                    <h5 style={headingStyles}>3. Manage & Claim</h5>
                    <p>View your policy details and manage your insurance directly from your dashboard.</p>
                </Col>
            </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
