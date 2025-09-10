import React from 'react';
import { Card, Table, Button, Spinner, Badge, ButtonGroup } from 'react-bootstrap';

/**
 * A component to display a list of all submitted claims.
 *
 * @param {object} props
 * @param {Array} props.claims - The array of claim objects.
 * @param {boolean} props.loading - A flag to indicate if claims are being fetched.
 * @param {function} props.onApprove - Callback function when an admin approves a claim.
 * @param {function} props.onReject - Callback function when an admin rejects a claim.
 */
const ClaimList = ({ claims, loading, onApprove, onReject }) => {
  // Custom styles for the dark theme
  const cardStyles = {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    border: '1px solid #374151',
    marginTop: '2rem', // Add some space above the list
  };

  const tableStyles = {
    color: '#D1D5DB',
    verticalAlign: 'middle',
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1: // Approved
        return <Badge bg="success">Approved</Badge>;
      case 2: // Rejected
        return <Badge bg="danger">Rejected</Badge>;
      case 0: // Pending
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading claims...</span>
          </Spinner>
        </div>
      );
    }

    if (!claims || claims.length === 0) {
      return <p className="text-center py-4">No claims have been submitted.</p>;
    }

    return (
      <Table striped hover responsive style={tableStyles} variant="dark">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Policy ID</th>
            <th>Claimant</th>
            <th>Amount (ETH)</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id}>
              <td>{claim.id}</td>
              <td>{claim.policyId}</td>
              <td title={claim.claimant}>{`${claim.claimant.substring(0, 6)}...${claim.claimant.substring(claim.claimant.length - 4)}`}</td>
              <td>{claim.amount}</td>
              <td>{claim.reason}</td>
              <td>{getStatusBadge(claim.status)}</td>
              <td>
                {/* Show approve/reject buttons only for pending claims */}
                {claim.status === 0 && (
                  <ButtonGroup size="sm">
                    <Button variant="outline-success" onClick={() => onApprove(claim.id)}>Approve</Button>
                    <Button variant="outline-danger" onClick={() => onReject(claim.id)}>Reject</Button>
                  </ButtonGroup>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Card style={cardStyles}>
      <Card.Body>
        <Card.Title as="h2" className="mb-4">Manage Claims</Card.Title>
        {renderContent()}
      </Card.Body>
    </Card>
  );
};

export default ClaimList;
