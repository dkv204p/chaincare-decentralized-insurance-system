# ChainCare - A Decentralized Insurance Platform

**ChainCare** is a full-stack decentralized application (DApp) built on the Ethereum blockchain. It leverages smart contracts to automate the lifecycle of insurance policies and claims, ensuring transparency, security, and trust. The platform is designed as a proof-of-concept to address the inefficiencies and fraud prevalent in the traditional insurance industry.

## Features

### ✅ Frontend (React.js + Bootstrap)
- **User Authentication**: Secure registration and login functionality.
- **Wallet Integration**: Seamless connection with MetaMask for signing transactions.
- **Role-Based Dashboards**: Separate, tailored user interfaces for regular users (policyholders) and the administrator.
- **Policy & Claim Management**: Users can view their policies and submit claims, while the admin can create policies and manage all claims.

### ✅ Backend (Node.js + Express + MongoDB)
- **RESTful API**: Provides endpoints for user management and secure admin actions.
- **JWT Authentication**: Secures API endpoints with JSON Web Tokens to protect routes.
- **Off-Chain Storage**: Uses MongoDB to securely store user credentials (usernames, hashed passwords).
- **Blockchain Gateway**: The backend acts as a secure agent for the admin, signing and sending transactions (like approving a claim) on their behalf.

### ✅ Blockchain (Solidity + Truffle + Ganache)
- **Smart Contract Core**: A single, unified smart contract governs all on-chain logic for policies and claims.
- **Immutable Ledger**: All policy and claim data is stored on-chain, creating a permanent and auditable record.
- **Event-Driven Architecture**: Emits events for key actions, allowing the frontend to easily monitor on-chain activity.
- **Comprehensive Testing**: The smart contract includes a full suite of unit tests.

---

## 📚 Technology Stack

| Layer     | Technology                          |
|----------|------------------------------------|
| Blockchain | Solidity, Ethereum, Truffle Suite, Ganache |
| Backend   | Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, Web3.js |
| Frontend  | React.js, Bootstrap, Web3.js, MetaMask Integration |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or later)
- Truffle Suite (`npm install -g truffle`)
- Ganache UI (Personal blockchain for local development)
- MetaMask (Browser extension wallet)
- MongoDB (Local instance or MongoDB Atlas connection URI)

### Installation & Setup

#### 1. Clone the Repository:
```bash
git clone https://github.com/dkv204p/chaincare-decentralized-insurance-system.git
cd chaincare-decentralized-insurance-system
````

#### 2. Install Dependencies:

```bash
# Install backend dependencies
cd chaincare-server
npm install

# Install frontend dependencies
cd ../chaincare-client
npm install

# Install blockchain dependencies
cd ../chaincare-blockchain
npm install
```

#### 3. Start Ganache:

* Open the Ganache application and create a new workspace.
* Note the RPC Server URL (e.g., `http://127.0.0.1:7545`).
* Copy the private key of the first account (this will be your admin).

#### 4. Deploy Smart Contract:

```bash
cd chaincare-blockchain
truffle migrate --reset
```

* Copy the PolicyContract address from the output.

#### 5. Configure Environment Variables:

**Backend (`chaincare-server/.env`):**

```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=a_very_long_and_random_secret_string_for_security
PORT=5000
WEB3_PROVIDER=http://127.0.0.1:7545
POLICY_CONTRACT_ADDRESS=<paste_the_new_contract_address_here>
ADMIN_PRIVATE_KEY=<paste_the_ganache_admin_private_key_without_0x_prefix>
```

**Frontend (`chaincare-client/.env`):**

```env
REACT_APP_POLICY_CONTRACT_ADDRESS=<paste_the_same_new_contract_address_here>
```

#### 6. Run the Application:

```bash
# Start backend
cd chaincare-server
npm start

# Start frontend (in another terminal)
cd ../chaincare-client
npm run dev
```

---

## 📖 Usage Guide

1. Open your browser and go to [http://localhost:3000](http://localhost:3000).
2. Configure MetaMask to connect to the local Ganache network.
3. **Admin**:

   * Register with the username `admin`.
   * Create policies and manage claims from the dashboard.
4. **User**:

   * Register with any other username.
   * Connect MetaMask wallet and view assigned policies.
   * Submit claims for approval.

---

## 📂 API Endpoints

### Authentication (`/api/auth`)

* `POST /register`: Register a new user.
* `POST /login`: Login and receive a JWT.
* `GET /users`: \[Admin only] Get all registered users.

### Policies (`/api/policies`)

* `POST /`: \[Admin only] Create a new policy.
* `GET /`: \[Authenticated users] Fetch policies from the blockchain.

### Claims (`/api/claims`)

* `GET /`: \[Admin only] Fetch all claims.
* `POST /approve/:id`: \[Admin only] Approve a claim.
* `POST /reject/:id`: \[Admin only] Reject a claim.

---

## 📄 License

This project is licensed under the **MIT License**.

---

Feel free to explore, contribute, or raise issues. For questions, reach out via the project’s GitHub repository.
