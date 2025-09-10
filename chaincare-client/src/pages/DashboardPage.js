import React, { useState, useEffect, useCallback } from 'react';
import { Container, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { api } from '../utils/api';

// Import all necessary components
import CreatePolicyForm from '../components/CreatePolicyForm';
import PolicyList from '../components/PolicyList';
import UserList from '../components/UserList';
import ClaimList from '../components/ClaimList';
import SubmitClaimForm from '../components/SubmitClaimForm'; // 1. Import the new form

// --- STYLES FOR DARK THEME ---
const pageStyles = {
  backgroundColor: '#111827',
  color: '#D1D5DB',
  padding: '2rem 0',
  minHeight: 'calc(100vh - 128px)',
};

const headingStyles = {
  color: '#FFFFFF',
};

const DashboardPage = ({ user, token }) => {
  const [policies, setPolicies] = useState([]);
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const [fetchedPolicies, fetchedUsers, fetchedClaims] = await Promise.all([
        api.get('/policies', token),
        user?.username === 'admin' ? api.get('/auth/users', token) : Promise.resolve([]),
        user?.username === 'admin' ? api.get('/claims', token) : Promise.resolve([]),
      ]);
      fetchedPolicies.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setPolicies(fetchedPolicies);
      setUsers(fetchedUsers);
      setClaims(fetchedClaims);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePolicyCreated = () => {
    fetchData();
  };
  
  // Callback for when a user submits a claim
  const handleClaimSubmitted = () => {
    // In a real app, you might want to show a global success notification
    console.log("Claim submitted. Admin will review it shortly.");
  };

  const handleApproveClaim = async (claimId) => {
    try {
      await api.post(`/claims/${claimId}/approve`, {}, token);
      fetchData();
    } catch (err) {
      setError(err.message || `Failed to approve claim #${claimId}`);
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      await api.post(`/claims/${claimId}/reject`, {}, token);
      fetchData();
    } catch (err) {
      setError(err.message || `Failed to reject claim #${claimId}`);
    }
  };

  const isAdmin = user && user.username === 'admin';

  const userPolicies = isAdmin 
    ? policies 
    : policies.filter(p => user?.ethAddress && p.user.toLowerCase() === user.ethAddress.toLowerCase());

  const renderAdminDashboard = () => (
    <>
      <Row className="mb-4">
        <Col lg={7} className="mb-4 mb-lg-0">
          <CreatePolicyForm onPolicyCreated={handlePolicyCreated} token={token} />
        </Col>
        <Col lg={5}>
          <UserList users={users} loading={isLoading && users.length === 0} />
        </Col>
      </Row>
      <PolicyList policies={policies} loading={isLoading} />
      <ClaimList 
        claims={claims} 
        loading={isLoading} 
        onApprove={handleApproveClaim}
        onReject={handleRejectClaim}
      />
    </>
  );

  const renderUserDashboard = () => (
    // 2. Create a two-column layout for the user dashboard
    <Row>
        <Col lg={7} className="mb-4 mb-lg-0">
            {/* The user's policies are on the left */}
            <PolicyList policies={userPolicies} loading={isLoading} />
        </Col>
        <Col lg={5}>
            {/* The claim submission form is on the right */}
            <SubmitClaimForm 
                userPolicies={userPolicies} 
                onClaimSubmitted={handleClaimSubmitted} 
            />
        </Col>
    </Row>
  );

  return (
    <div style={pageStyles}>
      <Container>
        <h2 className="mb-4" style={headingStyles}>
          {isAdmin ? 'Admin Dashboard' : 'My Policies & Claims'}
        </h2>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {isAdmin ? renderAdminDashboard() : renderUserDashboard()}
      </Container>
    </div>
  );
};

export default DashboardPage;
