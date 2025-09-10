import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { Web3 } from 'web3';
import PolicyContractABI from '../contracts/PolicyContract.json';

// --- Component ---

const SubmitClaimForm = ({ userPolicies, onClaimSubmitted }) => {
  // State for form inputs
  const [policyId, setPolicyId] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!policyId || !reason || !amount) {
      setError('All fields are required.');
      return;
    }
    if (!window.ethereum) {
        setError('MetaMask is not installed. Please install it to submit a claim.');
        return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
        // 1. Connect to the user's wallet (MetaMask)
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        // 2. Create an instance of the smart contract
        const contractAddress = process.env.REACT_APP_POLICY_CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error("Contract address is not configured. Please set REACT_APP_POLICY_CONTRACT_ADDRESS in your .env file.");
        }
        const policyContract = new web3.eth.Contract(PolicyContractABI.abi, contractAddress);

        // 3. Prepare the transaction
        const amountInWei = web3.utils.toWei(amount, 'ether');
        const tx = policyContract.methods.submitClaim(policyId, reason, amountInWei);

        // 4. Send the transaction from the user's account
        console.log("Requesting user to sign transaction...");
        const receipt = await tx.send({ from: userAddress });
        console.log("Transaction successful:", receipt.transactionHash);

        setSuccess(`Claim submitted successfully!`);
        // Clear the form
        setPolicyId('');
        setReason('');
        setAmount('');
        // Notify the parent component
        if (onClaimSubmitted) {
            onClaimSubmitted();
        }

    } catch (err) {
      setError(err.message || 'Failed to submit claim. The transaction may have been rejected.');
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
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
  };

  return (
    <Card style={cardStyles} className="mb-4">
      <Card.Body>
        <Card.Title as="h2" className="mb-4">Submit a New Claim</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formPolicyId">
            <Form.Label>Select Your Policy</Form.Label>
            <Form.Select 
              style={inputStyles} 
              value={policyId} 
              onChange={(e) => setPolicyId(e.target.value)} 
              required
            >
              <option value="">-- Choose a policy --</option>
              {userPolicies.filter(p => p.isActive).map(policy => (
                <option key={policy.id} value={policy.id}>
                  Policy #{policy.id} - {policy.policyDetails}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formClaimReason">
            <Form.Label>Reason for Claim</Form.Label>
            <Form.Control
              style={inputStyles}
              as="textarea"
              rows={3}
              placeholder="e.g., Accident on the highway, rear-ended."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formClaimAmount">
            <Form.Label>Amount to Claim (in ETH)</Form.Label>
            <Form.Control
              style={inputStyles}
              type="number"
              step="0.01"
              placeholder="e.g., 0.25"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>

          <Button style={buttonStyle} type="submit" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Submit Claim via Wallet'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SubmitClaimForm;
