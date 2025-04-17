import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import CertificationABI from '../../abis/CertificationABI.json';
import AboutABI from '../../abis/AboutABI.json';
import WorkExperienceABI from '../../abis/WorkExperienceABI.json';
import OrgProfileABI from '../../abis/OrgProfileABI.json';
import './ProfileCard.css';

const certificationAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const aboutAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const workExperienceAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const orgProfileAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

const ProfileCard = ({ web3 }) => {
  const { ethAddress } = useParams();
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [reputationScore, setReputationScore] = useState(0);
  const [workExperience, setWorkExperience] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const initialize = async () => {
      if (!ethAddress) return;

      setLoading(true);

      try {
        await loadProfile(ethAddress);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [ethAddress]);

  const loadProfile = async (ethAddress) => {
    try {
      const web3Instance = new Web3(window.ethereum);

      // Always try to load the organization profile first
      const orgProfileContract = new web3Instance.eth.Contract(OrgProfileABI, orgProfileAddress);
      const profile = await orgProfileContract.methods.getProfile(ethAddress).call();

      // Set organization profile data if found
      setProfileData({
        companyName: profile[0] || '',
        companyEthAddress: profile[1] || '',
        emailAddress: profile[2] || '',
        websiteURL: profile[3] || '',
        slogan: profile[4] || ''
      });

      // Regardless of organization data, load the employee profile as well
      await loadEmployeeProfile(ethAddress, web3Instance);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadEmployeeProfile = async (ethAddress, web3Instance) => {
    try {
      await loadCertificateData(ethAddress, web3Instance);
      await loadReputationScore(ethAddress, web3Instance);
      await loadAboutData(ethAddress, web3Instance);
      await loadWorkExperienceData(ethAddress, web3Instance);
    } catch (error) {
      console.error('Error loading employee profile:', error);
    }
  };

  const loadCertificateData = async (ethAddress, web3Instance) => {
    try {
      const contract = new web3Instance.eth.Contract(CertificationABI, certificationAddress);
      const certificates = await contract.methods.getCertificates(ethAddress).call();
      setCertificates(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const loadReputationScore = async (ethAddress, web3Instance) => {
    try {
      const certificationContract = new web3Instance.eth.Contract(CertificationABI, certificationAddress);
      const certScore = await certificationContract.methods.getReputationScore(ethAddress).call();
      const workExperienceContract = new web3Instance.eth.Contract(WorkExperienceABI, workExperienceAddress);
      const workScore = await workExperienceContract.methods.getReputationScore(ethAddress).call();
      const combinedScore = parseInt(certScore, 10) + parseInt(workScore, 10);
      setReputationScore(combinedScore.toString());
    } catch (error) {
      console.error('Error fetching reputation score:', error);
    }
  };

  const loadAboutData = async (ethAddress, web3Instance) => {
    try {
      const contract = new web3Instance.eth.Contract(AboutABI, aboutAddress);
      const profile = await contract.methods.getProfile(ethAddress).call();
      setAbout(profile);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const loadWorkExperienceData = async (ethAddress, web3Instance) => {
    try {
      const contract = new web3Instance.eth.Contract(WorkExperienceABI, workExperienceAddress);
      const experiences = await contract.methods.getExperiences(ethAddress).call();
      setWorkExperience(experiences);
    } catch (error) {
      console.error('Error fetching work experience data:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Navbar ethAddress={ethAddress} />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">Profile</Typography>
          </Grid>
          {profileData.companyName ? (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5">Organization Profile</Typography>
                <Typography variant="body1"><strong>Company Name:</strong> {profileData.companyName}</Typography>
                <Typography variant="body1"><strong>Company Ethereum Address:</strong> {profileData.companyEthAddress}</Typography>
                <Typography variant="body1"><strong>Email Address:</strong> {profileData.emailAddress}</Typography>
                <Typography variant="body1"><strong>Website URL:</strong> {profileData.websiteURL}</Typography>
                <Typography variant="body1"><strong>Slogan:</strong> {profileData.slogan}</Typography>
              </Paper>
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                  <Typography variant="h5">Personal Details</Typography>
                  <Typography variant="body1">Name: <strong>{about?.name}</strong></Typography>
                  <Typography variant="body1">Location: <strong>{about?.location}</strong></Typography>
                  <Typography variant="body1">Phone: <strong>{about?.phoneNumber}</strong></Typography>
                  <Typography variant="body1">Email: <strong>{about?.emailAddress}</strong></Typography>
                  <Typography variant="body1">Summary: <strong>{about?.personalSummary}</strong></Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                  <Typography variant="h5">Work Experience</Typography>
                  {workExperience.length > 0 ? (
                    workExperience.map((experience, index) => (
                      <div key={index}>
                        <Typography variant="body1">Job Title: <strong>{experience.jobTitle}</strong></Typography>
                        <Typography variant="body1">Company: <strong>{experience.companyName}</strong></Typography>
                        <Typography variant="body1">Company Ethereum Address: <strong>{experience.companyEthAddress}</strong></Typography>
                        <Typography variant="body1">Duration: <strong>{experience.startDate}</strong> - <strong>{experience.endDate}</strong></Typography>
                        <Typography variant="body1">Description: <strong>{experience.description}</strong></Typography>
                        <Typography variant="body1">Work Experience Status: <strong>{experience.validated ? "Validated" : "Not Validated"}</strong></Typography>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body1">No work experience submitted yet</Typography>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                  <Typography variant="h5">Certifications</Typography>
                  {certificates.length > 0 ? (
                    certificates.map((cert, index) => (
                      <div key={index}>
                          <Typography variant="body1">Course Name: <strong>{cert.courseName}</strong></Typography>
                          <Typography variant="body1">Issue Date: <strong>{cert.issueDate}</strong></Typography>
                          <Typography variant="body1">Issuer: <strong>{cert.issuer}</strong></Typography>
                          <Typography variant="body1">Certificate Type: <strong>{cert.certType}</strong></Typography>
                          <Typography variant="body1">
                            IPFS Hash: <a href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`} target="_blank" rel="noopener noreferrer"><strong>View Certificate</strong></a>
                          </Typography>
                          <Typography variant="body1">{cert.certFileHash}</Typography>
                          <Typography variant="body1">Certificate Status: <strong>{cert.validated ? "Validated" : "Not Validated"}</strong></Typography>                      </div>
                    ))
                  ) : (
                    <Typography variant="body1">No certifications found</Typography>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                  <Typography variant="h5">Reputation Score</Typography>
                  <Typography variant="body1">
                    Reputation Score is: <strong>{reputationScore}</strong>
                  </Typography>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default ProfileCard;
