const { Web3 } = require('web3');
require('dotenv').config();

// --- Contract Setup ---
const PolicyContractABI = require('../../chaincare-blockchain/build/contracts/PolicyContract.json').abi;
const PolicyContractAddress = process.env.POLICY_CONTRACT_ADDRESS;

// --- Web3 Setup ---
const web3 = new Web3(process.env.WEB3_PROVIDER || 'http://127.0.0.1:7545');
if (!PolicyContractAddress) {
    throw new Error("POLICY_CONTRACT_ADDRESS is not set in the .env file.");
}
const policyContract = new web3.eth.Contract(PolicyContractABI, PolicyContractAddress);

// --- Admin Account Setup ---
if (!process.env.ADMIN_PRIVATE_KEY) {
  throw new Error("ADMIN_PRIVATE_KEY is not set in the .env file.");
}
const adminAccount = web3.eth.accounts.privateKeyToAccount('0x' + process.env.ADMIN_PRIVATE_KEY);

// =================================================================
// --- Helper Function to Send Transactions ---
// =================================================================
const sendAdminTransaction = async (tx) => {
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

    const signedTx = await web3.eth.accounts.signTransaction(transactionObject, adminAccount.privateKey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};


// =================================================================
// --- Controller Functions ---
// =================================================================

/**
 * Fetches all claims from the blockchain. (Admin only)
 */
const getAllClaims = async (req, res) => {
    try {
        const claimCount = await policyContract.methods.claimCount().call();
        const claims = await Promise.all(
            Array.from({ length: Number(claimCount) }, async (_, i) => {
                const claim = await policyContract.methods.getClaim(i).call();
                // Convert BigInts to strings and format for frontend
                return {
                    id: claim.id.toString(),
                    policyId: claim.policyId.toString(),
                    claimant: claim.claimant,
                    reason: claim.reason,
                    amount: web3.utils.fromWei(claim.amount.toString(), 'ether'),
                    status: Number(claim.status) // 0: Pending, 1: Approved, 2: Rejected
                };
            })
        );
        res.json(claims);
    } catch (error) {
        console.error('Error in getAllClaims:', error);
        res.status(500).json({ message: 'Failed to fetch claims', error: error.message });
    }
};

/**
 * Approves a claim. (Admin only)
 */
const approveClaim = async (req, res) => {
    const { claimId } = req.params;
    try {
        const tx = policyContract.methods.approveClaim(claimId);
        const receipt = await sendAdminTransaction(tx);
        res.status(200).json({ message: `Claim #${claimId} approved successfully`, transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error('Error in approveClaim:', error);
        res.status(500).json({ message: 'Failed to approve claim', error: error.message });
    }
};

/**
 * Rejects a claim. (Admin only)
 */
const rejectClaim = async (req, res) => {
    const { claimId } = req.params;
    try {
        const tx = policyContract.methods.rejectClaim(claimId);
        const receipt = await sendAdminTransaction(tx);
        res.status(200).json({ message: `Claim #${claimId} rejected successfully`, transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error('Error in rejectClaim:', error);
        res.status(500).json({ message: 'Failed to reject claim', error: error.message });
    }
};


module.exports = { getAllClaims, approveClaim, rejectClaim };
