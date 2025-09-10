import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ContactPage = () => {
  // --- Styles for Dark Theme ---
  const pageStyles = {
    backgroundColor: '#111827',
    minHeight: 'calc(100vh - 128px)',
    display: 'flex',
    alignItems: 'center',
    padding: '2rem 0',
  };

  const headingStyles = {
    color: '#FFFFFF',
  };

  const labelStyles = {
    color: '#9CA3AF',
  };

  const inputStyles = {
    backgroundColor: '#374151',
    color: '#D1D5DB',
    border: '1px solid #4B5563',
  };

  const primaryButtonStyle = {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    fontWeight: 500,
  };

  return (
    <div style={pageStyles}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="text-center mb-4" style={headingStyles}>Get In Touch</h2>
            <Form>
              <Form.Group className="mb-3" controlId="contactName">
                <Form.Label style={labelStyles}>Your Name</Form.Label>
                <Form.Control style={inputStyles} type="text" placeholder="Enter your name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="contactEmail">
                <Form.Label style={labelStyles}>Email address</Form.Label>
                <Form.Control style={inputStyles} type="email" placeholder="Enter your email" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="contactMessage">
                <Form.Label style={labelStyles}>Message</Form.Label>
                <Form.Control style={inputStyles} as="textarea" rows={3} />
              </Form.Group>
              <div className="d-grid">
                <Button style={primaryButtonStyle} type="submit">
                  Send Message
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
