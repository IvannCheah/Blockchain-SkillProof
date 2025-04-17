import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import WorkExperienceABI from '../../abis/WorkExperienceABI.json'; // Corrected import for WorkExperience ABI
import CertificationABI from '../../abis/CertificationABI.json'; // Import the Certification contract ABI
import './WorkExpValidate.css'; // Import the CSS file

const workExperienceAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Corrected WorkExperience contract address
const certificationAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your actual Certification contract address

const WorkExpValidate = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [workExperiences, setWorkExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reputationScores, setReputationScores] = useState({}); // Store reputation scores for each employee

  useEffect(() => {
    const initialize = async () => {
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed!');
        setLoading(false);
        return;
      }

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          alert('No accounts found. Please connect to MetaMask.');
          setLoading(false);
          return;
        }

        const userAccount = accounts[0];
        setAccount(userAccount);

        await loadAllWorkExperiences(web3Instance, userAccount);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Failed to connect to MetaMask or Hardhat. Please check your setup.');
      } finally {
        setLoading(false);
      }
    };

    initialize();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);
        await loadAllWorkExperiences(web3);
      } else {
        alert('Please connect to MetaMask');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const loadAllWorkExperiences = async (web3Instance, userAccount) => {
    if (!web3Instance) {
      console.error('Web3 is not initialized');
      return;
    }

    try {
      const workExperienceContract = new web3Instance.eth.Contract(WorkExperienceABI, workExperienceAddress);
      const certificationContract = new web3Instance.eth.Contract(CertificationABI, certificationAddress);
      const allWorkExperiences = [];
      const reputationScores = {};

      const employeeAddresses = await getAllEmployeeAddresses(workExperienceContract);
      console.log('Employee Addresses:', employeeAddresses); // Debugging statement

      for (const address of employeeAddresses) {
        // Fetch work experiences
        const userWorkExperiences = await workExperienceContract.methods.getExperiences(address).call({ from: address });

        // Filter experiences based on the companyEthAddress matching the current account
        const filteredExperiences = userWorkExperiences.filter(exp => exp.companyEthAddress.toLowerCase() === userAccount.toLowerCase());

        if (filteredExperiences.length > 0) {
          allWorkExperiences.push({ address, experiences: filteredExperiences });
        }

        // Fetch reputation score from WorkExperience contract
        const workExperienceReputationScore = await workExperienceContract.methods.getReputationScore(address).call();
        console.log('Work Experience Reputation Score for', address, ':', workExperienceReputationScore); // Debugging statement

        // Fetch reputation score from Certification contract
        const certificationReputationScore = await certificationContract.methods.getReputationScore(address).call();
        console.log('Certification Reputation Score for', address, ':', certificationReputationScore); // Debugging statement

        // Calculate total reputation score
        const totalReputationScore = parseInt(workExperienceReputationScore) + parseInt(certificationReputationScore);
        reputationScores[address] = totalReputationScore.toString(); // Store combined reputation score
      }

      setWorkExperiences(allWorkExperiences);
      setReputationScores(reputationScores); // Update state with reputation scores
    } catch (error) {
      console.error('Error fetching work experiences:', error);
      alert('Failed to fetch work experiences. Please try again later.');
    }
  };

  const getAllEmployeeAddresses = async (contract) => {
    return await contract.methods.getAllEmployeeAddresses().call();
  };

  const validateExperience = async (userAddress, expIndex) => {
    try {
      if (!web3) {
        alert('Web3 is not initialized. Please reload the page.');
        return;
      }

      const contract = new web3.eth.Contract(WorkExperienceABI, workExperienceAddress);

      // Get the current nonce for the account
      const nonce = await web3.eth.getTransactionCount(account, 'latest');

      // Send transaction to validate the experience
      await contract.methods.validateExperience(userAddress, expIndex).send({
        from: account,
        nonce: nonce
      });

      alert('Work experience validated successfully!');

      // Fetch the updated reputation score before updating the state
      const updatedScore = await contract.methods.getReputationScore(userAddress).call();

      // Log the updated score for debugging
      console.log('Updated Reputation Score:', updatedScore);

      // Update the reputation score state
      setReputationScores(prevScores => ({
        ...prevScores,
        [userAddress]: updatedScore.toString() // Ensure it's a string for consistency
      }));

      // Reload work experiences to reflect validation changes
      await loadAllWorkExperiences(web3, account);
    } catch (error) {
      console.error('Error validating work experience:', error);
      alert(`Error validating work experience: ${error.message || 'Internal JSON-RPC error.'}`);
    }
  };

  return (
    <div className="work-exp-container">
      <h2>Work Experience Validation</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="work-exp-list">
          {workExperiences.map((entry, entryIndex) => (
            <div key={entryIndex} className="work-exp-entry">
              <h3>Employee: {entry.address} - Reputation Score: {reputationScores[entry.address]}</h3> {/* Display Reputation Score */}
              <ul>
                {entry.experiences.map((exp, expIndex) => (
                  <li key={expIndex} className="work-exp-item">
                    <p><strong>Job Title:</strong> {exp.jobTitle}</p>
                    <p><strong>Company:</strong> {exp.companyName}</p>
                    <p><strong>Company Ethereum Address:</strong> {exp.companyEthAddress}</p>
                    <p><strong>Start Date:</strong> {exp.startDate}</p>
                    <p><strong>End Date:</strong> {exp.endDate}</p>
                    <p><strong>Description:</strong> {exp.description}</p>
                    <p><strong>Status:</strong> {exp.validated ? 'Validated' : 'Not Validated'}</p>
                    {!exp.validated && (
                      <button onClick={() => validateExperience(entry.address, expIndex)}>
                        Validate
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkExpValidate;
