import React, { useState } from 'react';
import { Card, Table, Button, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';

/**
 * A component to display a list of registered users.
 *
 * @param {object} props
 * @param {Array} props.users - The array of user objects to display.
 * @param {boolean} props.loading - A flag to indicate if users are being fetched.
 */
const UserList = ({ users, loading }) => {
  // State to provide feedback when a user ID is copied
  const [copiedId, setCopiedId] = useState(null);

  // Custom styles for the dark theme
  const cardStyles = {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    border: '1px solid #374151',
    height: '100%', // Make card fill the column height
  };

  const tableStyles = {
    color: '#D1D5DB',
    verticalAlign: 'middle', // Better aligns content vertically
  };

  /**
   * Copies the user's MongoDB _id to the clipboard and shows a temporary confirmation message.
   * @param {string} userId - The ID of the user to copy.
   */
  const handleCopyId = (userId) => {
    navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    // Hide the "Copied!" message after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading users...</span>
          </Spinner>
        </div>
      );
    }

    if (!users || users.length === 0) {
      return <p className="text-center py-4">No registered users found.</p>;
    }

    return (
      <Table striped hover responsive style={tableStyles} variant="dark">
        <thead>
          <tr>
            <th>Username</th>
            <th>Ethereum Address</th>
            <th>User ID (for Policy Creation)</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                {/* Add a tooltip to show the full address on hover */}
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-${user._id}`}>{user.ethAddress}</Tooltip>}
                >
                  <span>{`${user.ethAddress.substring(0, 6)}...${user.ethAddress.substring(user.ethAddress.length - 4)}`}</span>
                </OverlayTrigger>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleCopyId(user._id)}
                    title="Copy User ID"
                  >
                    Copy ID
                  </Button>
                  {/* Show a confirmation message when ID is copied */}
                  {copiedId === user._id && <span className="ms-2 text-success small">Copied!</span>}
                </div>
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
        <Card.Title as="h2" className="mb-4">Registered Users</Card.Title>
        {renderContent()}
      </Card.Body>
    </Card>
  );
};

export default UserList;
