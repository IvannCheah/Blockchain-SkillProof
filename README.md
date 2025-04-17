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

---

## 🚀 How to Run

Follow these steps to set up and run the SkillProof platform on your local machine:

1. **Download or Clone the Repository**

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Hardhat Local Blockchain**
   Open a new terminal and run:
   ```bash
   npx hardhat node
   ```

4. **Deploy Smart Contracts**
   In a new terminal tab/window:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project, enable Firestore and Authentication (Email/Password)
   - Replace your Firebase config inside a `.env` file at the root of your project:
     ```env
     REACT_APP_API_KEY=your_api_key
     REACT_APP_AUTH_DOMAIN=your_auth_domain
     REACT_APP_PROJECT_ID=your_project_id
     REACT_APP_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_MESSAGING_SENDER_ID=your_sender_id
     REACT_APP_APP_ID=your_app_id
     ```

6. **Run the Frontend App**
   ```bash
   npm start
   ```

7. **Connect MetaMask**
   - Install the MetaMask extension in your browser.
   - Import one of the accounts from Hardhat (use the private key printed when you run `npx hardhat node`).
   - Make sure MetaMask is connected to `http://127.0.0.1:8545` (Custom RPC).
   - Refresh the app and interact with the platform!

8. **Explore the App**
