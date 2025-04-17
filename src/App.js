import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Admin from './pages/Admin/Admin';
import Home from './pages/Home/Home';
import Login from './components/Login/Login';
import Employee from './pages/Employee/Employee';
import Organization from './pages/Organization/Organization';
import Footer from './components/Footer/Footer';
import ProfileCard from './components/ProfileCard/ProfileCard';

function App() {
  const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed!');
        return;
      }

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setUserAddress(accounts[0]);

        console.log("Connected address:", accounts[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setLoading(false);
      }
    };

    init();

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setUserAddress(accounts[0]);
      navigate('/login');
    } else {
      alert('Please connect to MetaMask');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin web3={web3} ethAddress={userAddress} />} />
          <Route path="/employee/*" element={<Employee web3={web3} ethAddress={userAddress} />} />
          <Route path="/organization/*" element={<Organization web3={web3} ethAddress={userAddress} />} />
          <Route path="/profile/:ethAddress" element={<ProfileCard web3={web3} />} />
        </Routes>
      )}
      <Footer />
    </div>
  );
}

export default App;
