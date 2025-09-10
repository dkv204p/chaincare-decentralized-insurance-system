import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';

// --- Helper functions are now included directly in this file to make it self-contained ---

const API_URL = 'http://localhost:5000/api';

const api = {
  async post(endpoint, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  },
};

const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const baseStyle = {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    border: '1px solid',
    borderRadius: '0.5rem',
  };
  const variantStyles = {
    success: { borderColor: '#10B981', color: '#A7F3D0' },
    danger: { borderColor: '#EF4444', color: '#FECACA' },
  };
  const notificationStyle = { ...baseStyle, ...variantStyles[type] };
  return (
    <Alert style={notificationStyle} onClose={onDismiss} dismissible className="mt-3">
      {message}
    </Alert>
  );
};


// --- Main AuthPage Component ---

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Styles for Dark Theme ---
  const pageStyles = {
    backgroundColor: '#111827',
    minHeight: 'calc(100vh - 128px)',
    display: 'flex',
    alignItems: 'center',
    padding: '2rem 0',
  };

  const cardStyles = {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    border: '1px solid #374151',
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
  
  const linkButtonStyle = {
      color: '#3B82F6',
      textDecoration: 'none'
  };

  // --- Component Logic ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setEthAddress(accounts[0]);
      } catch (err) {
        setError('Failed to connect wallet. Please make sure MetaMask is unlocked.');
      }
    } else {
      setError('MetaMask is not installed. Please install it to continue.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isLogin && !ethAddress) {
      setError('Please connect your wallet to register.');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { username, password } : { username, password, ethAddress };
      const data = await api.post(endpoint, body);
      
      if (isLogin) {
        onAuthSuccess(data);
      } else {
        alert('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={pageStyles}>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card className="p-4 shadow-sm" style={cardStyles}>
              <Card.Body>
                <h2 className="text-center mb-4 text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <div className="d-grid gap-2 mb-4">
                  <Button style={primaryButtonStyle} onClick={connectWallet}>
                    Connect Wallet
                  </Button>
                  {ethAddress && <p className="text-muted text-center small mb-0">Connected: {`${ethAddress.substring(0, 6)}...${ethAddress.substring(38)}`}</p>}
                </div>

                <Form onSubmit={handleSubmit}>
                  {error && <Notification message={error} type="danger" onDismiss={() => setError('')} />}
                  
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label style={labelStyles}>Username</Form.Label>
                    <Form.Control style={inputStyles} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label style={labelStyles}>Password</Form.Label>
                    <Form.Control style={inputStyles} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </Form.Group>

                  {!isLogin && (
                    <Form.Group className="mb-3" controlId="ethAddress">
                      <Form.Label style={labelStyles}>Ethereum Address</Form.Label>
                      <Form.Control style={inputStyles} type="text" value={ethAddress} readOnly placeholder="Connect wallet to populate" required />
                    </Form.Group>
                  )}

                  <div className="d-grid">
                    <Button style={primaryButtonStyle} type="submit" disabled={isLoading}>
                      {isLoading ? <Spinner as="span" animation="border" size="sm" /> : (isLogin ? 'Login' : 'Register')}
                    </Button>
                  </div>
                </Form>
                <p className="text-center mt-3">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <Button variant="link" style={linkButtonStyle} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Register here' : 'Login here'}
                  </Button>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthPage;
