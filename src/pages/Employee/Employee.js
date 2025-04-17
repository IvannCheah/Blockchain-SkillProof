import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import Leaderboard from '../Leaderboard';
import Navbar from '../../components/Navbar/Navbar';
import './Employee.css';

const Employee = ({ web3, ethAddress }) => {
  return (
    <div>
      <Navbar web3={web3} ethAddress={ethAddress} />
      <div className="employee-home">
        <Routes>
          <Route
            path="/"
            element={
              <div className="content-wrapper">
                <h1>Welcome to SkillProof</h1>
                <p className="intro-text">
                  We're thrilled to have you on board. SkillProof helps you manage and showcase your skills through verified certifications. Upload your certificates, keep track of your progress, and enhance your professional profile.
                </p>

                <h2>How to Interact with SkillProof</h2>
                <p className="section-text">
                  SkillProof is designed to help you manage and showcase your skills through verified certifications. You can upload your certificates, which will be validated by the admin. Keep track of your progress, stay updated with the latest skill requirements, and enhance your professional profile.
                </p>

                <h2>Update Your Profile</h2>
                <p className="section-text">
                  Make sure to keep your profile up to date. You can add new certificates, update your work experience, and enhance your personal summary. Each validated certificate and updated work experience will contribute to your overall reputation score, making your profile stand out.
                </p>

                <h2>Strive for Excellence</h2>
                <p className="section-text">
                  Continuous learning is the key to professional growth. By earning more certificates, you not only enhance your skills but also increase your reputation score. Aim for the top spot on our leaderboard by staying committed to learning and development. Compete with fellow employees and showcase your achievements!
                </p>

                <div className="reputation-system">
                  <div className="reputation-left">
                    <h2>How to Earn Reputation Score</h2>
                    <p>Your reputation score reflects your skills and professional achievements within SkillProof. Here’s how you can earn reputation points:</p>
                    <ol>
                      <li><strong>Validated Certificates:</strong> Earn reputation points by uploading and getting your certificates validated by the admin.</li>
                      <li><strong>Validated Work Experience:</strong> Submit your work experience for validation by your organization. Each validated work experience will add 50 points to your reputation score.</li>
                    </ol>
                  </div>
                  <div className="reputation-right">
                    <h2>Certificate Type Descriptions</h2>
                    <div className="certificate-level">
                      <h3>Basic Certificate (Score: 10)</h3>
                      <p><strong>Examples: Participation certificates, attendance certificates, basic training certificates.</strong></p>
                      <p>Characteristics: Often awarded for completing a short course, workshop, or event. They typically indicate basic knowledge or participation in a specific activity.</p>
                    </div>
                    <div className="certificate-level">
                      <h3>Intermediate Certificate (Score: 20)</h3>
                      <p><strong>Examples: Diploma certificates, specialized course certificates, vocational certificates.</strong></p>
                      <p>Characteristics: These certificates often require a more substantial level of knowledge and skills. They may involve coursework, practical training, and assessments.</p>
                    </div>
                    <div className="certificate-level">
                      <h3>Advanced Certificate (Score: 30)</h3>
                      <p><strong>Examples: Bachelor's degrees, master's degrees, professional certifications (e.g., PMP, CISSP).</strong></p>
                      <p>Characteristics: These certificates represent advanced education and training. They often require significant academic or professional experience.</p>
                    </div>
                    <div className="certificate-level">
                      <h3>Professional Certificate (Score: 50)</h3>
                      <p><strong>Examples: Industry-specific certifications, licenses, and accreditations.</strong></p>
                      <p>Characteristics: These certificates validate expertise in a specific field and are often required for professional practice. They may involve rigorous exams and practical experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default Employee;
