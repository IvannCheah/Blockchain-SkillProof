# SkillProof: Blockchain-based Platform for Skill Verification and Reputation Building

**SkillProof** is a blockchain-powered platform designed to securely verify and showcase professional skills and work experiences. By replacing traditional paper-based credentials with tamper-proof blockchain records, SkillProof ensures authenticity, transparency, and long-term integrity of achievements. What sets SkillProof apart is its built-in reputation system, which assigns users a score based on validated certifications and work experiences. This encourages continuous learning and provides a measurable way to track personal growth. With decentralized storage, transparent validation, and a dynamic leaderboard, SkillProof empowers individuals to build strong, credible professional profiles while helping employers confidently verify qualifications—ultimately promoting a culture of lifelong learning and trust.

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

