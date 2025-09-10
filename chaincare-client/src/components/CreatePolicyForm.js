import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { api } from '../utils/api'; 

/**
 * A form component for administrators to create new insurance policies for users.
 *
 * @param {object} props
 * @param {function} props.onPolicyCreated - A callback function to refresh the policy list after creation.
 * @param {string} props.token - The JWT token for making authenticated API calls.
 */
const CreatePolicyForm = ({ onPolicyCreated, token }) => {
  // State for form inputs
  const [userId, setUserId] = useState('');
  const [policyDetails, setPolicyDetails] = useState('');
  const [premium, setPremium] = useState('');

  // State for managing UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !policyDetails || !premium) {
      setError('All fields are required.');
      return;
    }
    if (!token) {
      setError('Authentication token is missing. Cannot create policy.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const policyData = {
        userId,
        policyDetails,
        premium: parseFloat(premium), // Ensure premium is a number
      };
      
      await api.post('/policies', policyData, token);

      setSuccess('Policy created successfully!');
      // Clear the form
      setUserId('');
      setPolicyDetails('');
      setPremium('');
      // Trigger the parent component to refresh the policy list
      if (onPolicyCreated) {
        onPolicyCreated();
      }
    } catch (err) {
      setError(err.message || 'Failed to create policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for the dark theme
  const cardStyles = {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    border: '1px solid #374151',
  };

  const inputStyles = {
    backgroundColor: '#374151',
    color: '#D1D5DB',
    border: '1px solid #4B5563',
  };

  const buttonStyle = {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    fontWeight: 500,
  };

  return (
    <Card style={cardStyles} className="mb-4">
      <Card.Body>
        <Card.Title as="h2" className="mb-4">Create New Policy</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUserId">
            <Form.Label>User ID</Form.Label>
             <Form.Control
              style={inputStyles}
              type="text"
              placeholder="Enter the MongoDB User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              You need to get the user's ID from your MongoDB database.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPolicyDetails">
            <Form.Label>Policy Details</Form.Label>
            <Form.Control
              style={inputStyles}
              type="text"
              placeholder="e.g., Comprehensive Car Insurance"
              value={policyDetails}
              onChange={(e) => setPolicyDetails(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPremium">
            <Form.Label>Premium (in ETH)</Form.Label>
            <Form.Control
              style={inputStyles}
              type="number"
              step="0.01"
              placeholder="e.g., 0.5"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              required
            />
          </Form.Group>

          <Button style={buttonStyle} type="submit" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Create Policy'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePolicyForm;
