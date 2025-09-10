// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PolicyContract {
    // --- Structs ---
    struct Policy {
        uint id;
        address user;
        string policyDetails;
        uint premium; // Stored in Wei
        bool isActive;
    }

    struct Claim {
        uint id;
        uint policyId;
        address claimant;
        string reason;
        uint amount; // Amount requested in Wei
        Status status; // Use an Enum for claim status
    }

    // Enum for clear status tracking
    enum Status { Pending, Approved, Rejected }

    // --- State Variables ---
    mapping(uint => Policy) public policies;
    uint public policyCount;

    mapping(uint => Claim) public claims;
    uint public claimCount;

    address public admin;

    // --- Events ---
    event PolicyCreated(uint id, address user, string policyDetails, uint premium);
    event PolicyCancelled(uint id);
    event ClaimSubmitted(uint claimId, uint policyId, address claimant, uint amount);
    event ClaimApproved(uint claimId);
    event ClaimRejected(uint claimId);

    // --- Modifiers ---
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // =================================================================
    // Policy Functions
    // =================================================================

    function createPolicy(address _user, string memory _policyDetails, uint _premium) public onlyAdmin {
        require(_user != address(0), "User address cannot be zero");
        require(_premium > 0, "Premium must be greater than 0");
        policies[policyCount] = Policy(policyCount, _user, _policyDetails, _premium, true);
        emit PolicyCreated(policyCount, _user, _policyDetails, _premium);
        policyCount++;
    }

    function cancelPolicy(uint _id) public onlyAdmin {
        require(_id < policyCount, "Policy with this ID does not exist");
        require(policies[_id].isActive, "Policy is already inactive");
        policies[_id].isActive = false;
        emit PolicyCancelled(_id);
    }

    // =================================================================
    // Claim Functions (NEW)
    // =================================================================

    /**
     * @dev Allows a policyholder to submit a claim against their active policy.
     * @param _policyId The ID of the policy being claimed against.
     * @param _reason A description of the claim.
     * @param _amount The amount being claimed, in Wei.
     */
    function submitClaim(uint _policyId, string memory _reason, uint _amount) public {
        require(_policyId < policyCount, "Policy does not exist");
        Policy storage policyToClaim = policies[_policyId];
        
        require(policyToClaim.user == msg.sender, "You can only claim against your own policy");
        require(policyToClaim.isActive, "Cannot claim against an inactive policy");
        require(_amount > 0, "Claim amount must be greater than 0");

        claims[claimCount] = Claim(claimCount, _policyId, msg.sender, _reason, _amount, Status.Pending);
        emit ClaimSubmitted(claimCount, _policyId, msg.sender, _amount);
        claimCount++;
    }

    /**
     * @dev Allows the admin to approve a pending claim.
     * @param _claimId The ID of the claim to approve.
     */
    function approveClaim(uint _claimId) public onlyAdmin {
        require(_claimId < claimCount, "Claim does not exist");
        Claim storage claimToApprove = claims[_claimId];
        require(claimToApprove.status == Status.Pending, "Claim is not pending");

        claimToApprove.status = Status.Approved;
        
        // In a real-world scenario, you would trigger the payment here.
        // For example: payable(claimToApprove.claimant).transfer(claimToApprove.amount);
        // This requires the contract to hold funds.

        emit ClaimApproved(_claimId);
    }

    /**
     * @dev Allows the admin to reject a pending claim.
     * @param _claimId The ID of the claim to reject.
     */
    function rejectClaim(uint _claimId) public onlyAdmin {
        require(_claimId < claimCount, "Claim does not exist");
        Claim storage claimToReject = claims[_claimId];
        require(claimToReject.status == Status.Pending, "Claim is not pending");

        claimToReject.status = Status.Rejected;
        emit ClaimRejected(_claimId);
    }


    // =================================================================
    // View Functions
    // =================================================================
    
    function getPolicy(uint _id) public view returns (Policy memory) {
        return policies[_id];
    }

    function getClaim(uint _id) public view returns (Claim memory) {
        return claims[_id];
    }
}
