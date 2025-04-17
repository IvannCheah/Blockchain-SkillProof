import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrgProfile from './OrgProfile';
import WorkExpValidate from './WorkExpValidate';
import Leaderboard from '../Leaderboard';
import Navbar from '../../components/Navbar/Navbar';
import './Organization.css';

const Organization = ({ web3, ethAddress }) => {
    return (
        <div>
            <Navbar web3={web3} ethAddress={ethAddress} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="organization-home">
                            <div className="content-wrapper">
                                <h1>Welcome, Organization!</h1>
                                <p className="intro-text">
                                    Welcome to the Organization Panel of SkillProof. This panel is your control center where you can manage your profile, validate work experiences, and monitor employee rankings.
                                </p>

                                <h2>Getting Started</h2>
                                <p className="section-text">
                                    As an organization, you have a vital role in ensuring the integrity and functionality of the SkillProof platform. Below, you will find detailed instructions on how to perform your duties effectively.
                                </p>

                                <h2>Managing Your Profile</h2>
                                <p className="section-text">
                                    Navigate to the "Profile" section using the navigation bar. Here, you can update and manage your organization's profile information. Keeping your profile up-to-date is crucial for maintaining credibility on the platform.
                                </p>

                                <h2>Validating Work Experience</h2>
                                <p className="section-text">
                                    One of your key responsibilities is to validate the work experience submitted by employees. Navigate to the "Work Experience Validation" section to review pending submissions. Carefully assess each submission for accuracy and authenticity before approving or rejecting it. Your validation helps maintain the credibility of the SkillProof platform.
                                </p>

                                <h2>Monitoring Employee Rankings</h2>
                                <p className="section-text">
                                    The leaderboard section allows you to view the rankings of employees based on their reputation scores. This is a great way to recognize and encourage top performers within your organization. Use the navigation bar to access the Leaderboard section.
                                </p>
                            </div>
                        </div>
                    }
                />
                <Route path="orgprofile" element={<OrgProfile />} />
                <Route path="workexpvalidate" element={<WorkExpValidate />} />
                <Route path="leaderboard" element={<Leaderboard />} />
            </Routes>
        </div>
    );
};

export default Organization;
