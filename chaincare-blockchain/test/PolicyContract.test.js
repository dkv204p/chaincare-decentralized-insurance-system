const PolicyContract = artifacts.require("PolicyContract");
const truffleAssert = require('truffle-assertions');

contract("PolicyContract", (accounts) => {
  let policyContract;
  const admin = accounts[0];
  const user = accounts[1];
  const anotherUser = accounts[2];

  // Deploy a new contract instance before each test
  beforeEach(async () => {
    policyContract = await PolicyContract.new({ from: admin });
  });

  it("should create a policy correctly", async () => {
    // Pass the user's address when creating the policy
    await policyContract.createPolicy(user, "Health Policy", 100, { from: admin });
    const policy = await policyContract.policies(0);

    assert.equal(policy.id, 0, "Policy ID should be 0");
    assert.equal(policy.user, user, "Policy user address does not match");
    assert.equal(policy.policyDetails, "Health Policy", "Policy details do not match");
    assert.equal(policy.premium, 100, "Premium amount does not match");
    assert.equal(policy.isActive, true, "Policy should be active");
  });

  it("should increment policy count after creation", async () => {
    const initialCount = await policyContract.policyCount();
    assert.equal(initialCount.toNumber(), 0, "Initial count should be 0");

    await policyContract.createPolicy(user, "Car Insurance", 150, { from: admin });
    const newCount = await policyContract.policyCount();
    
    assert.equal(newCount.toNumber(), 1, "Policy count did not increment correctly");
  });

  it("should emit a PolicyCreated event on creation", async () => {
    const receipt = await policyContract.createPolicy(user, "Health Policy", 100, { from: admin });
    
    // Use truffle-assertions to check for the event
    truffleAssert.eventEmitted(receipt, 'PolicyCreated', (ev) => {
      return ev.id.toNumber() === 0 && ev.user === user && ev.premium.toNumber() === 100;
    }, 'PolicyCreated event should be emitted with correct parameters');
  });

  it("should cancel a policy", async () => {
    // First, create a policy to cancel
    await policyContract.createPolicy(user, "Health Policy", 100, { from: admin });
    
    // Then, cancel it
    await policyContract.cancelPolicy(0, { from: admin });
    const policy = await policyContract.policies(0);
    
    assert.equal(policy.isActive, false, "Policy should be inactive after cancellation");
  });

  it("should not allow non-admin to create a policy", async () => {
    // Use truffle-assertions for cleaner revert checks
    await truffleAssert.reverts(
      policyContract.createPolicy(user, "Travel Policy", 200, { from: anotherUser }),
      "Only admin can perform this action"
    );
  });

  it("should not allow non-admin to cancel a policy", async () => {
    await policyContract.createPolicy(user, "Travel Policy", 200, { from: admin });
    
    await truffleAssert.reverts(
      policyContract.cancelPolicy(0, { from: anotherUser }),
      "Only admin can perform this action"
    );
  });
  
  it("should revert when cancelling a non-existent policy", async () => {
    await truffleAssert.reverts(
      policyContract.cancelPolicy(99, { from: admin }),
      "Policy with this ID does not exist"
    );
  });
});