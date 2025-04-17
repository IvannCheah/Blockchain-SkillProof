import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CertificationABI from '../../abis/CertificationABI.json';
import AboutABI from '../../abis/AboutABI.json';
import WorkExperienceABI from '../../abis/WorkExperienceABI.json';
import { PinataSDK } from 'pinata-web3';
import { Container, Grid, Paper, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import './Profile.css';

const certificationAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const aboutAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const workExperienceAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

// Pinata instance setup
const pinata = new PinataSDK({
  pinataJwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNTFlMTZlZS05M2FiLTQwYTgtYWU3NC1lZGFmNmM4YTI1MjIiLCJlbWFpbCI6Iml2YW4uY2hlYWg0MEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZWEwZjFiNDBjODYwZTk4MmYzYzIiLCJzY29wZWRLZXlTZWNyZXQiOiJkMzhmODEzMDQ3N2VkZGI2ZmZiYTJjZTA4NmM0ZDQ0MjBmOGQ2Y2RkOWVmNzU3M2YxOWU0ZWFmZjNmMjk4MGQyIiwiZXhwIjoxNzY0NTc2MzczfQ.LMduTRamd_KAIjyaUyVtSdNjUK3MnzTFN8V27JjtqZo',
  pinataGateway: 'blush-elegant-otter-628.mypinata.cloud',
});

// Styled components
const ContainerStyled = styled(Container)({
  marginTop: '32px',
});

const SectionStyled = styled(Paper)({
  padding: '16px',
  marginBottom: '24px',
});

const FormStyled = styled('form')({
  display: 'flex',
  flexDirection: 'column',
});

const TextFieldStyled = styled(TextField)({
  marginBottom: '16px',
});

const ButtonStyled = styled(Button)({
  marginTop: '16px',
});

const LoadingStyled = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

const Profile = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState({});
  const [aboutForm, setAboutForm] = useState({
    name: '',
    location: '',
    phoneNumber: '',
    emailAddress: '',
    personalSummary: '',
  });
  const [certificates, setCertificates] = useState([]);
  const [certificatesForm, setCertificatesForm] = useState({
    courseName: '',
    issueDate: '',
    issuer: '',
    certType: '',
    certificateFile: null,
  });
  const [reputationScore, setReputationScore] = useState(0);
  const [workExperience, setWorkExperience] = useState([]);
  const [workForm, setWorkForm] = useState({
    jobTitle: '',
    companyName: '',
    companyEthAddress: '',
    startDate: '',
    endDate: '',
    description: ''
  });

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

        await loadCertificateData(userAccount, web3Instance);
        await loadReputationScore(userAccount, web3Instance);
        await loadAboutData(userAccount, web3Instance);
        await loadWorkExperienceData(userAccount, web3Instance);
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
        await loadCertificateData(userAccount, web3);
        await loadReputationScore(userAccount, web3);
        await loadAboutData(userAccount, web3);
        await loadWorkExperienceData(userAccount, web3);
      } else {
        alert('Please connect to MetaMask');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [web3]);

  const loadCertificateData = async (address, web3Instance) => {
    if (!web3Instance) {
      console.error('Web3 is not initialized');
      return;
    }
    try {
      const contract = new web3Instance.eth.Contract(CertificationABI, certificationAddress);
      const certificates = await contract.methods.getCertificates(address).call({ from: address });
      setCertificates(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      alert('Failed to fetch certificates. Please try again later.');
    }
  };

  const handleCertInputChange = (e) => {
    setCertificatesForm({ ...certificatesForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCertificatesForm({ ...certificatesForm, certificateFile: e.target.files[0] });
  };

  const loadReputationScore = async (address, web3Instance) => {
    if (!web3Instance) {
      console.error('Web3 is not initialized');
      return;
    }

    try {
      // Fetch reputation score from Certification contract
      const certificationContract = new web3Instance.eth.Contract(CertificationABI, certificationAddress);
      const certScore = await certificationContract.methods.getReputationScore(address).call({ from: address });

      // Fetch reputation score from WorkExperience contract
      const workExperienceContract = new web3Instance.eth.Contract(WorkExperienceABI, workExperienceAddress);
      const workScore = await workExperienceContract.methods.getReputationScore(address).call({ from: address });

      // Combine the scores
      const combinedScore = parseInt(certScore, 10) + parseInt(workScore, 10);
      setReputationScore(combinedScore.toString());
    } catch (error) {
      console.error('Error fetching reputation score:', error);
      alert('Failed to fetch reputation score. Please try again later.');
    }
  };

  const loadAboutData = async (address, web3Instance) => {
    if (!web3Instance) {
      console.error('Web3 is not initialized');
      return;
    }
    try {
      const contract = new web3Instance.eth.Contract(AboutABI, aboutAddress);
      const profile = await contract.methods.getProfile(address).call({ from: address });
      setAbout(profile);
    } catch (error) {
      console.error('Error fetching about data:', error);
      alert('Failed to fetch about data. Please try again later.');
    }
  };

  const loadWorkExperienceData = async (address, web3Instance) => {
    if (!web3Instance) {
      console.error('Web3 is not initialized');
      return;
    }
    try {
      const contract = new web3Instance.eth.Contract(WorkExperienceABI, workExperienceAddress);
      const experiences = await contract.methods.getExperiences(address).call({ from: address });
      setWorkExperience(experiences);
    } catch (error) {
      console.error('Error fetching work experience data:', error);
      alert('Failed to fetch work experience data. Please try again later.');
    }
  };

  const submitCertificate = async (e) => {
    e.preventDefault();
    const { courseName, issueDate, issuer, certType, certificateFile } = certificatesForm;

    if (!courseName || !issueDate || !issuer || !certType || !certificateFile) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (!web3) {
        alert('Web3 is not initialized. Please reload the page.');
        return;
      }

      // Use Pinata SDK to upload the certificate file to IPFS
      const pinataResponse = await pinata.upload.file(certificateFile);
      const ipfsHash = pinataResponse.IpfsHash;

      const fileUrl = `https://blush-elegant-otter-628.mypinata.cloud/ipfs/${ipfsHash}`;
      console.log('File URL:', fileUrl);

      const contract = new web3.eth.Contract(CertificationABI, certificationAddress);
      const nonce = await web3.eth.getTransactionCount(account, 'latest');

      const tx = await contract.methods.submitCertificate(
        courseName, issueDate, issuer, certType, ipfsHash
      ).send({
        from: account,
        nonce: nonce
      });

      console.log(tx);

      alert('Certificate submitted successfully!');
      await loadCertificateData(account, web3);
      await loadReputationScore(account, web3);

    } catch (error) {
      console.error('Error submitting certificate:', error);
      alert(`Error submitting certificate: ${error.message || 'Internal error.'}`);
    }
  };

  const handleAboutInputChange = (e) => {
    setAboutForm({ ...aboutForm, [e.target.name]: e.target.value });
  };

  const submitAbout = async (e) => {
    e.preventDefault();
    const { name, location, phoneNumber, emailAddress, personalSummary } = aboutForm;

    if (!name || !location || !phoneNumber || !emailAddress || !personalSummary) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const contract = new web3.eth.Contract(AboutABI, aboutAddress);
      const nonce = await web3.eth.getTransactionCount(account, 'latest');

      const tx = await contract.methods.setProfile(
        aboutForm.name, aboutForm.location, aboutForm.phoneNumber, aboutForm.emailAddress, aboutForm.personalSummary
      ).send({
        from: account,
        nonce: nonce
      });

      console.log(tx);

      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error updating about section:', error);
      alert(`Error updating about section: ${error.message || 'Internal error.'}`);
    }
  };

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setWorkForm((prevExperience) => ({
        ...prevExperience,
        [name]: value,
    }));
  };

  const handleEndDateChange = () => {
    setWorkForm((prevExperience) => ({
        ...prevExperience,
        endDate: prevExperience.endDate === 'Present' ? '' : 'Present',
    }));
  };

  const submitWorkExperience = async (e) => {
    e.preventDefault();
    const { jobTitle, companyName, companyEthAddress, startDate, endDate, description } = workForm;

    if (!jobTitle || !companyName || !companyEthAddress || !startDate || !endDate || !description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const contract = new web3.eth.Contract(WorkExperienceABI, workExperienceAddress);
      const nonce = await web3.eth.getTransactionCount(account, 'latest');

      const tx = await contract.methods.addExperience(
        jobTitle, companyName, companyEthAddress, startDate, endDate, description
      ).send({
        from: account,
        nonce: nonce
      });

      console.log(tx);

      alert('Work experience added successfully!');
    } catch (error) {
      console.error('Error adding work experience:', error);
      alert(`Error adding work experience: ${error.message || 'Internal error.'}`);
    }
  };

  return (
    <ContainerStyled>
      {loading ? (
        <LoadingStyled>
          <CircularProgress />
        </LoadingStyled>
      ) : (
        <>
          <Grid container spacing={3} className="container">
            <Grid item xs={12}>
              <Typography variant="h4" align="center" className="MuiTypography-root">Profile</Typography>
            </Grid>
            <Grid item xs={12}>
              <SectionStyled className="section">
                <Typography variant="h5" className="MuiTypography-root">Personal Details</Typography>
                <Typography variant="body1">Name: <strong>{about?.name}</strong></Typography>
                <Typography variant="body1">Location: <strong>{about?.location}</strong></Typography>
                <Typography variant="body1">Phone: <strong>{about?.phoneNumber}</strong></Typography>
                <Typography variant="body1">Email: <strong>{about?.emailAddress}</strong></Typography>
                <Typography variant="body1">Summary: <strong>{about?.personalSummary}</strong></Typography>
              </SectionStyled>
              <SectionStyled className="section">
                <Typography variant="h5" className="MuiTypography-root">Reputation Score</Typography>
                <Typography variant="body1"><strong>{reputationScore}</strong></Typography>
              </SectionStyled>
              <SectionStyled className="section">
                <Typography variant="h5" className="MuiTypography-root">Certifications</Typography>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <div>
                    {certificates.length > 0 ? (
                      certificates.map((cert, index) => (
                        <div key={index} className="certification-item">
                          <Typography variant="body2">Course Name: <strong>{cert.courseName}</strong></Typography>
                          <Typography variant="body2">Issue Date: <strong>{cert.issueDate}</strong></Typography>
                          <Typography variant="body2">Issuer: <strong>{cert.issuer}</strong></Typography>
                          <Typography variant="body2">Certificate Type: <strong>{cert.certType}</strong></Typography>
                          <Typography variant="body2">
                            IPFS Hash: <a href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`} target="_blank" rel="noopener noreferrer"><strong>View Certificate</strong></a>
                          </Typography>
                          <Typography variant="body2">{cert.certFileHash}</Typography>
                          <Typography variant="body2">Certificate Status: <strong>{cert.validated ? "Validated" : "Not Validated"}</strong></Typography>
                        </div>
                      ))
                    ) : (
                      <Typography variant="body1">No certificates submitted yet</Typography>
                    )}
                  </div>
                )}
              </SectionStyled>
              <SectionStyled className="section">
                <Typography variant="h5" className="MuiTypography-root">Work Experience</Typography>
                {workExperience.length > 0 ? (
                  workExperience.map((experience, index) => (
                    <div key={index} className="work-experience-item">
                      <Typography variant="body1">Job Title: <strong>{experience.jobTitle}</strong></Typography>
                      <Typography variant="body1">Company: <strong>{experience.companyName}</strong></Typography>
                      <Typography variant="body1">CompanyEthAddress: <strong>{experience.companyEthAddress}</strong></Typography>
                      <Typography variant="body1">Duration: <strong>{experience.startDate}</strong> - <strong>{experience.endDate}</strong></Typography>
                      <Typography variant="body1">Description: <strong>{experience.description}</strong></Typography>
                      <Typography variant="body1">Work Experience Status: <strong>{experience.validated ? "Validated" : "Not Validated"}</strong></Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body1">No work experience submitted yet</Typography>
                )}
              </SectionStyled>
            </Grid>
          </Grid>
  
          <Typography variant="h4" align="center" gutterBottom>Update Profile</Typography>
  
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <SectionStyled>
                <Typography variant="h5" gutterBottom>About</Typography>
                <FormStyled onSubmit={submitAbout}>
                  <TextFieldStyled
                    label="Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={aboutForm?.name || ''}
                    onChange={handleAboutInputChange}
                  />
                  <TextFieldStyled
                    label="Location"
                    variant="outlined"
                    fullWidth
                    name="location"
                    value={aboutForm?.location || ''}
                    onChange={handleAboutInputChange}
                  />
                  <TextFieldStyled
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    name="phoneNumber"
                    value={aboutForm?.phoneNumber || ''}
                    onChange={handleAboutInputChange}
                  />
                  <TextFieldStyled
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    name="emailAddress"
                    value={aboutForm?.emailAddress || ''}
                    onChange={handleAboutInputChange}
                  />
                  <TextFieldStyled
                    label="Personal Summary"
                    variant="outlined"
                    fullWidth
                    multiline
                    name="personalSummary"
                    value={aboutForm?.personalSummary || ''}
                    onChange={handleAboutInputChange}
                  />
                  <ButtonStyled type="submit" variant="contained" color="primary">
                    Update Profile
                  </ButtonStyled>
                </FormStyled>
              </SectionStyled>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <SectionStyled>
                <Typography variant="h5" gutterBottom>Certificates</Typography>
                <FormStyled onSubmit={submitCertificate}>
                  <TextFieldStyled
                    label="Course Name"
                    variant="outlined"
                    fullWidth
                    name="courseName"
                    value={certificatesForm?.courseName || ''}
                    onChange={handleCertInputChange}
                  />
                  <label>Issue Date:</label>
                  <TextFieldStyled
                    type="date"
                    name="issueDate"
                    value={certificatesForm?.issueDate || ''}
                    onChange={handleCertInputChange}
                    style={{ width: '100%', marginBottom: '16px' }}
                  />
                  <TextFieldStyled
                    label="Issuer"
                    variant="outlined"
                    fullWidth
                    name="issuer"
                    value={certificatesForm?.issuer || ''}
                    onChange={handleCertInputChange}
                  />
                  <label>Certificate Type</label>
                  <select
                    value={certificatesForm?.certType || ''}
                    onChange={(e) => setCertificatesForm({ ...certificatesForm, certType: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', marginBottom: '16px' }}
                  >
                    <option value="">Select Certificate Type</option>
                    <option value="Basic Certificate">Basic Certificate</option>
                    <option value="Intermediate Certificate">Intermediate Certificate</option>
                    <option value="Advanced Certificate">Advanced Certificate</option>
                    <option value="Professional Certificate">Professional Certificate</option>
                  </select>
                  <input
                    type="file"
                    accept="application/pdf, image/*"
                    onChange={handleFileChange}
                  />
                  <ButtonStyled type="submit" variant="contained" color="primary">
                    Submit Certificate
                  </ButtonStyled>
                </FormStyled>
              </SectionStyled>
            </Grid>
  
            <Grid item xs={12}>
              <SectionStyled>
                <Typography variant="h5" gutterBottom>Work Experience</Typography>
                <FormStyled onSubmit={submitWorkExperience}>
                  <TextFieldStyled
                    label="Job Title"
                    variant="outlined"
                    fullWidth
                    name="jobTitle"
                    value={workForm?.jobTitle || ''}
                    onChange={handleWorkInputChange}
                  />
                  <TextFieldStyled
                    label="Company Name"
                    variant="outlined"
                    fullWidth
                    name="companyName"
                    value={workForm?.companyName || ''}
                    onChange={handleWorkInputChange}
                  />
                  <TextFieldStyled
                    label="Company Ethereum Address"
                    variant="outlined"
                    fullWidth
                    name="companyEthAddress"
                    value={workForm?.companyEthAddress || ''}
                    onChange={handleWorkInputChange}
                  />
                  <label>Start Date:</label>
                  <TextFieldStyled
                    type="date"
                    variant="outlined"
                    fullWidth
                    name="startDate"
                    value={workForm?.startDate || ''}
                    onChange={handleWorkInputChange}
                  />
                  <label>End Date:</label>
                  {workForm?.endDate === 'Present' ? (
                    <span>Present</span>
                  ) : (
                    <TextFieldStyled
                      type="date"
                      variant="outlined"
                      fullWidth
                      name="endDate"
                      value={workForm?.endDate || ''}
                      onChange={handleWorkInputChange}
                    />
                  )}
                  <ButtonStyled
                    type="button"
                    variant="outlined"
                    onClick={handleEndDateChange}
                  >
                    Currently Working At
                  </ButtonStyled>
                  <TextFieldStyled
                    label="Description"
                    variant="outlined"
                    fullWidth
                    name="description"
                    value={workForm?.description || ''}
                    onChange={handleWorkInputChange}
                  />
                  <ButtonStyled type="submit" variant="contained" color="primary">
                    Submit Work Experience
                  </ButtonStyled>
                </FormStyled>
              </SectionStyled>
            </Grid>
          </Grid>
        </>
      )}
    </ContainerStyled>
  );
};

export default Profile;
