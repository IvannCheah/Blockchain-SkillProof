import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateUser from './CreateUser';
import CertValidate from './CertValidate';
import Leaderboard from '../Leaderboard';
import Navbar from '../../components/Navbar/Navbar';
import './Admin.css';

const Admin = ({ web3, ethAddress }) => {
  return (
    <div>
      <Navbar web3={web3} ethAddress={ethAddress} />
      <div className="admin-home">
        <Routes>
          <Route
            path="/"
            element={
              <div className="content-wrapper">
                <h1>Welcome to SkillProof Admin Panel</h1>
                <p className="intro-text">
                  Welcome to the Admin Panel of SkillProof. This panel is your control center where you can manage users, validate certificates, and monitor the system's overall health.
                </p>

                <h2>Getting Started</h2>
                <p className="section-text">
                  As an admin, you play a crucial role in maintaining the integrity and functionality of the SkillProof platform. Below, you will find detailed instructions on how to perform your duties effectively.
                </p>

                <h2>Creating and Managing Users</h2>
                <p className="section-text">
                Navigate to the "Create User" section using the navigation bar. Here, you can add new users to the platform and assign them appropriate roles such as employee or organization. Additionally, this section allows you to review, accept, or reject registration requests from new users. Ensure that you provide accurate information for each user to facilitate smooth onboarding and maintain the integrity of the platform.
                </p>

                <h2>Validating Certificates</h2>
                <p className="section-text">
                  One of your key responsibilities is to validate certificates submitted by employees. Navigate to the "Cert Validate" section to view pending certificate submissions. Carefully review each certificate to ensure its authenticity and accuracy before approving or rejecting it. Your validation helps maintain the credibility of the SkillProof platform.
                </p>

                <h2>Leaderboard</h2>
                <p className="section-text">
                  The leaderboard section allows you to view the rankings of employees based on their reputation scores. This is a great way to recognize and encourage top performers. Use the navigation bar to access the Leaderboard section.
                </p>
              </div>
            }
          />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/certvalidate" element={<CertValidate />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
