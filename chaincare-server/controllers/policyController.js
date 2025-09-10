const { Web3 } = require('web3');
require('dotenv').config();
const User = require('../models/User');

// --- Contract Setup ---
// Ensure the path to the ABI JSON is correct relative to this file
const PolicyContractABI = require('../../chaincare-blockchain/build/contracts/PolicyContract.json').abi;
const PolicyContractAddress = process.env.POLICY_CONTRACT_ADDRESS;

// --- Web3 Setup ---
const web3 = new Web3(process.env.WEB3_PROVIDER || 'http://127.0.0.1:7545');

// Check if the contract address is provided before creating an instance
if (!PolicyContractAddress) {
    throw new Error("POLICY_CONTRACT_ADDRESS is not set in the .env file. Please deploy the contract and update the configuration.");
}
const policyContract = new web3.eth.Contract(PolicyContractABI, PolicyContractAddress);

// --- Admin Account Setup ---
// This section is critical for sending transactions from the server
if (!process.env.ADMIN_PRIVATE_KEY) {
  throw new Error("ADMIN_PRIVATE_KEY is not set in the .env file. The server cannot send transactions.");
}
// The '0x' prefix is required for the private key
const adminAccount = web3.eth.accounts.privateKeyToAccount('0x' + process.env.ADMIN_PRIVATE_KEY);

// =================================================================
// --- Controller Functions ---
// =================================================================

/**
 * Creates a new insurance policy on the blockchain.
 * This is an administrative action performed by the server.
 */
const createPolicy = async (req, res) => {
  // Destructure required fields from the request body
  const { userId, policyDetails, premium } = req.body;

  try {
    // 1. Validate input
    if (!userId || !policyDetails || !premium) {
      return res.status(400).json({ message: 'Missing required fields: userId, policyDetails, premium' });
    }

    // 2. Find the user in the database to get their Ethereum address
    const policyHolder = await User.findById(userId);
    if (!policyHolder) {
      return res.status(404).json({ message: 'User to create policy for not found.' });
    }
    const userEthAddress = policyHolder.ethAddress;

    // 3. Prepare the transaction data
    const premiumInWei = web3.utils.toWei(premium.toString(), 'ether');
    const tx = policyContract.methods.createPolicy(userEthAddress, policyDetails, premiumInWei);
    
    // 4. Estimate gas and get other necessary transaction parameters
    const gas = await tx.estimateGas({ from: adminAccount.address });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(adminAccount.address, 'latest');

    const transactionObject = {
      from: adminAccount.address,
      to: policyContract.options.address,
      data: tx.encodeABI(),
      gas,
      gasPrice,
      nonce,
    };

    // 5. Sign and send the transaction
    console.log(`Signing transaction for admin: ${adminAccount.address}`);
    const signedTx = await web3.eth.accounts.signTransaction(transactionObject, adminAccount.privateKey);
    
    console.log("Sending signed transaction...");
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction successful with hash:", receipt.transactionHash);

    // 6. Send a success response
    res.status(201).json({ message: 'Policy created successfully', transactionHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error in createPolicy:', error);
    // Ensure a response is only sent once
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to create policy', error: error.message });
    }
  }
};

/**
 * Fetches all policies from the blockchain.
 */
const getPolicies = async (req, res) => {
  try {
    // 1. Get the total number of policies from the smart contract
    const policyCount = await policyContract.methods.policyCount().call();

    // 2. Fetch each policy individually using a loop
    const policies = await Promise.all(
      // Create an array from 0 to policyCount-1 to iterate over
      Array.from({ length: Number(policyCount) }, async (_, i) => {
        const policy = await policyContract.methods.getPolicy(i).call();
        
        // **FIX APPLIED HERE:**
        // Directly construct a clean JavaScript object from the returned struct.
        // This is more readable and less complex than the previous method.
        return {
            id: policy.id.toString(),
            user: policy.user,
            policyDetails: policy.policyDetails,
            // Convert the premium from Wei to Ether for frontend display
            premium: web3.utils.fromWei(policy.premium.toString(), 'ether'), 
            isActive: policy.isActive
        };
      })
    );

    // 3. Send the array of policies as a JSON response
    res.json(policies);
  } catch (error) {
    console.error('Error in getPolicies:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to fetch policies', error: error.message });
    }
  }
};

module.exports = { createPolicy, getPolicies };
