import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import OrgProfileABI from '../../abis/OrgProfileABI.json';
import { Container, Grid, Paper, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';

const orgProfileAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

const OrgProfile = () => {
  const [web3, setWeb3] = useState(new Web3(window.ethereum));
  const [account, setAccount] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    companyEthAddress: '',
    emailAddress: '',
    websiteURL: '',
    slogan: ''
  });
  const [profileData, setProfileData] = useState({
    companyName: '',
    companyEthAddress: '',
    emailAddress: '',
    websiteURL: '',
    slogan: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        if (accounts[0]) {
          const orgProfileContract = new web3.eth.Contract(OrgProfileABI, orgProfileAddress);
          const profile = await orgProfileContract.methods.getProfile(accounts[0]).call();
          setProfileData({
            companyName: profile[0],
            companyEthAddress: profile[1],
            emailAddress: profile[2],
            websiteURL: profile[3],
            slogan: profile[4]
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [web3, account]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3) {
      alert('Web3 is not initialized. Please connect your wallet.');
      return;
    }

    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const orgProfileContract = new web3.eth.Contract(OrgProfileABI, orgProfileAddress);
      const nonce = await web3.eth.getTransactionCount(accounts[0], 'latest');
      await orgProfileContract.methods.setProfile(
        formData.companyName,
        formData.companyEthAddress,
        formData.emailAddress,
        formData.websiteURL,
        formData.slogan
      ).send({
        from: accounts[0],
        nonce: nonce
      });

      alert('Profile submitted successfully!');
      setProfileData(formData); // Update profile data with the submitted form data
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Error submitting profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      {/* Display Organization Profile */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Organization Profile
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Typography variant="body1"><strong>Company Name:</strong> {profileData.companyName}</Typography>
            <Typography variant="body1"><strong>Company Ethereum Address:</strong> {profileData.companyEthAddress}</Typography>
            <Typography variant="body1"><strong>Email Address:</strong> {profileData.emailAddress}</Typography>
            <Typography variant="body1"><strong>Website URL:</strong> {profileData.websiteURL}</Typography>
            <Typography variant="body1"><strong>Slogan:</strong> {profileData.slogan}</Typography>
          </Box>
        )}
      </Paper>

      {/* Display Update Organization Profile (Form to Submit New Profile) */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Update Organization Profile
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Ethereum Address"
                  name="companyEthAddress"
                  value={formData.companyEthAddress}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website URL"
                  name="websiteURL"
                  value={formData.websiteURL}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Slogan"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" type="submit">
                  Submit Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default OrgProfile;
