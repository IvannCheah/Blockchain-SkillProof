import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import query and where from Firestore
import Web3 from 'web3';
import CertificationABI from '../abis/CertificationABI.json';
import WorkExperienceABI from '../abis/WorkExperienceABI.json'; // Import the WorkExperience contract ABI
import './Leaderboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const certificationAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const workExperienceAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Replace with your actual WorkExperience contract address

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed!');
        return;
      }

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Failed to connect to MetaMask. Please check your setup.');
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch only users with role 'Employee'
        const employeesQuery = query(collection(db, 'users'), where('role', '==', 'Employee'));
        const querySnapshot = await getDocs(employeesQuery);
        const users = querySnapshot.docs.map(doc => doc.data());

        // Ensure all users have a 'name' property and a reputationScore
        const processedUsers = users.map(user => ({
          ...user,
          name: user.name || user.fullName || 'Unknown',
          reputationScore: user.reputationScore || 0,
          address: user.ethAddress // Assuming the Ethereum address is stored in the Firestore
        }));

        setLeaderboard(processedUsers);
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const fetchReputationScores = async () => {
      if (!web3) return;

      try {
        const certificationContract = new web3.eth.Contract(CertificationABI, certificationAddress);
        const workExperienceContract = new web3.eth.Contract(WorkExperienceABI, workExperienceAddress);

        const updatedLeaderboard = await Promise.all(
          leaderboard.map(async user => {
            if (!user.address || !web3.utils.isAddress(user.address)) {
              console.error('Invalid Ethereum address:', user.address);
              return { ...user, reputationScore: 'Invalid address', certificationAmount: 0, workExperienceAmount: 0 };
            }
            
            // Fetch reputation scores
            const certReputationScore = await certificationContract.methods.getReputationScore(user.address).call();
            const workExpReputationScore = await workExperienceContract.methods.getReputationScore(user.address).call();

            // Fetch the number of submitted certificates
            const certificates = await certificationContract.methods.getCertificates(user.address).call();
            const submittedCertificates = certificates.length; // Count the number of certificates

            // Fetch the number of submitted work experiences
            const experiences = await workExperienceContract.methods.getExperiences(user.address).call();
            const submittedWorkExperience = experiences.length; // Count the number of work experiences

            const totalReputationScore = parseInt(certReputationScore) + parseInt(workExpReputationScore);
            return {
              ...user,
              reputationScore: totalReputationScore.toString(),
              certificationAmount: submittedCertificates, // The count of submitted certificates
              workExperienceAmount: submittedWorkExperience // The count of submitted work experiences
            };
          })
        );

        updatedLeaderboard.sort((a, b) => b.reputationScore - a.reputationScore);
        setLeaderboard(updatedLeaderboard);
      } catch (error) {
        console.error('Error fetching reputation scores:', error);
      }
    };

    if (leaderboard.length > 0) {
      fetchReputationScores();
    }
  }, [web3, leaderboard.length]);

  const getRankClass = (index) => {
    switch (index) {
      case 0:
        return 'rank-gold';
      case 1:
        return 'rank-silver';
      case 2:
        return 'rank-bronze';
      default:
        return '';
    }
  };  

  return (
    <div className="leaderboard-container">
      <h2>Reputation Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Certification Amount</th>
            <th>Work Experience Amount</th>
            <th>Reputation Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index} className={getRankClass(index)}>
              <td>
                {index < 3 ? (
                  <i className={`fas fa-medal rank-medal ${getRankClass(index)}`}></i>
                ) : (
                  index + 1
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.certificationAmount || 0}</td>
              <td>{user.workExperienceAmount || 0}</td>
              <td>{user.reputationScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
