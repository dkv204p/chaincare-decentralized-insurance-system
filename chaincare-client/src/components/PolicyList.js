import React from 'react';
import { Card, Table, Spinner, Badge } from 'react-bootstrap';

/**
 * A component to display a list of insurance policies in a table.
 *
 * @param {object} props
 * @param {Array} props.policies - The array of policy objects to display.
 * @param {boolean} props.loading - A flag to indicate if the policies are currently being fetched.
 */
const PolicyList = ({ policies, loading }) => {

  // Custom styles for the dark theme
  const cardStyles = {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    border: '1px solid #374151',
  };

  const tableStyles = {
    color: '#D1D5DB',
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading policies...</span>
          </Spinner>
          <p className="mt-2">Fetching policies from the blockchain...</p>
        </div>
      );
    }

    if (!policies || policies.length === 0) {
      return <p className="text-center py-4">No policies found.</p>;
    }

    return (
      <Table striped hover responsive style={tableStyles} variant="dark">
        <thead>
          <tr>
            <th># ID</th>
            <th>User Address</th>
            <th>Details</th>
            <th>Premium (ETH)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id}>
              <td>{policy.id}</td>
              {/* Shorten the Ethereum address for better display */}
              <td>{`${policy.user.substring(0, 6)}...${policy.user.substring(policy.user.length - 4)}`}</td>
              <td>{policy.policyDetails}</td>
              <td>{policy.premium}</td>
              <td>
                <Badge bg={policy.isActive ? 'success' : 'danger'}>
                  {policy.isActive ? 'Active' : 'Inactive'}
                </Badge>
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
        <Card.Title as="h2" className="mb-4">All Insurance Policies</Card.Title>
        {renderContent()}
      </Card.Body>
    </Card>
  );
};

export default PolicyList;
