# SkillProof: Blockchain-based Platform for Skill Verification and Reputation Building

**SkillProof** is a blockchain-based skill verification and reputation scoring system. It allows users to securely store, verify, and manage their certificates and work experience using decentralized technologies such as Ethereum, IPFS, and smart contracts.

---

## 🧩 Features

- ✅ **Decentralized Skill Verification**
- 🛡️ **Tamper-proof Certificates via Blockchain**
- 📁 **Secure File Storage with IPFS (via Pinata)**
- ⭐ **Reputation Scoring Based on Certificates & Experience**
- 🔐 **Role-based Access Control (Admin, Employee, Organization)**
- 📊 **User Leaderboard to Encourage Continuous Learning**

---

## 🛠️ Technologies Used

### 🔗 Blockchain & Backend
- **Hardhat (Localhost)** – Local Ethereum-like blockchain for developing and testing smart contracts.
- **Solidity** – Language for writing smart contracts.
- **Web3.js** – Connects frontend to blockchain network.
- **Node.js** – Backend server logic.
- **Firebase** – NoSQL database for user authentication and profile storage.
- **Pinata + IPFS** – Decentralized storage for certificate files.

### 💻 Frontend
- **React.js** – User-friendly and dynamic interface.
- **JavaScript, HTML, CSS** – Core web technologies for structure and styling.
- **MetaMask** – Browser extension wallet for secure blockchain interaction.

---

## 🧪 How It Works

1. **User Registration**  
   Users request registration. Admin approves and assigns roles: Employee or Organization.

2. **Certificate Upload**  
   Employees upload certificates. Files are stored in IPFS, while metadata and hash are stored on-chain.

3. **Work Experience Validation**  
   Employees submit work experience which is then validated by the respective Organization through Ethereum transactions.

4. **Reputation Scoring**  
   Based on the level of certificate and work experience, users earn points that contribute to their rank on the leaderboard.

