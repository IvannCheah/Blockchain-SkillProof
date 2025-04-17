import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CertificationABI from '../../abis/CertificationABI.json';
import './CertValidate.css';

const certificationAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const CertValidate = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reputationScores, setReputationScores] = useState({});

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

        await loadAllCertificates(web3Instance);
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
        await loadAllCertificates(web3);
      } else {
        alert('Please connect to MetaMask');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const loadAllCertificates = async (web3Instance) => {
    if (!web3Instance) {
      console.error('Web3 is not initialized');
      return;
    }

    try {
      const contract = new web3Instance.eth.Contract(CertificationABI, certificationAddress);
      const allCertificates = [];
      const reputationScores = {};

      const employeeAddresses = await getAllEmployeeAddresses(contract);
      
      for (const address of employeeAddresses) {
        const userCertificates = await contract.methods.getCertificates(address).call({ from: address });
        allCertificates.push({ address, certificates: userCertificates });

        const reputationScore = await contract.methods.getReputationScore(address).call();
        reputationScores[address] = reputationScore.toString();
      }

      setCertificates(allCertificates);
      setReputationScores(reputationScores);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      alert('Failed to fetch certificates. Please try again later.');
    }
  };

  const getAllEmployeeAddresses = async (contract) => {
    return await contract.methods.getAllEmployeeAddresses().call();
  };

  const validateCertificate = async (userAddress, certIndex) => {
    try {
      if (!web3) {
        alert('Web3 is not initialized. Please reload the page.');
        return;
      }

      const contract = new web3.eth.Contract(CertificationABI, certificationAddress);
      const nonce = await web3.eth.getTransactionCount(account, 'latest');

      await contract.methods.validateCertificate(userAddress, certIndex).send({
        from: account,
        nonce: nonce
      });

      alert('Certificate validated successfully!');
      await loadAllCertificates(web3);

      const updatedScore = await contract.methods.getReputationScore(userAddress).call();
      setReputationScores(prevScores => ({
        ...prevScores,
        [userAddress]: updatedScore.toString()
      }));
    } catch (error) {
      console.error('Error validating certificate:', error);
      alert(`Error validating certificate: ${error.message || 'Internal error.'}`);
    }
  };

  return (
    <div className="cert-validate-container">
      <h2 className="page-title">Certificate Validation</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="cert-list">
          {certificates.map((entry, entryIndex) => (
            <div key={entryIndex} className="employee-card">
              <h3 className="employee-name">
                Employee: {entry.address} - Reputation Score: {reputationScores[entry.address]}
              </h3>
              <ul className="certificates">
                {entry.certificates.map((cert, certIndex) => (
                  <li key={certIndex} className="certificate-item">
                    <p>Course: <strong>{cert.courseName}</strong></p>
                    <p>Issuer: <strong>{cert.issuer}</strong></p>
                    <p>Type: <strong>{cert.certType}</strong></p>
                    <p>Issue Date: <strong>{cert.issueDate}</strong></p>
                    <p>IPFS Hash:
                      <a href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                      <strong>View Certificate</strong>
                      </a>
                    </p>
                    <p>Status: <strong>{cert.validated ? 'Validated' : 'Not Validated'}</strong></p>
                    {!cert.validated && (
                      <button className="validate-btn" onClick={() => validateCertificate(entry.address, certIndex)}>
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

export default CertValidate;
