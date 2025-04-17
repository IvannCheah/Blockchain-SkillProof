import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { db } from '../../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('employee');
    const [ethAddress, setEthAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getEthAddress = async () => {
            if (typeof window.ethereum === 'undefined') {
                alert('MetaMask is not installed!');
                return;
            }

            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Create a provider
                const provider = new ethers.BrowserProvider(window.ethereum);

                // Get the signer
                const signer = await provider.getSigner();

                // Get the connected address
                const address = await signer.getAddress();
                setEthAddress(address);

                console.log("Connected address:", address);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        };

        getEthAddress();

        // Handle account change
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, []);

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
            setEthAddress(accounts[0]);
        } else {
            alert('Please connect to MetaMask');
        }
    };

    const validatePassword = (password) => {
        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        return passwordPolicy.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            alert('Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        try {
            // Check if email or ethAddress already exists in either 'registrations' or 'users' collection
            const emailQueryUsers = query(collection(db, 'users'), where('email', '==', email));
            const ethQueryUsers = query(collection(db, 'users'), where('ethAddress', '==', ethAddress));
            const emailQueryRegistrations = query(collection(db, 'registrations'), where('email', '==', email));
            const ethQueryRegistrations = query(collection(db, 'registrations'), where('ethAddress', '==', ethAddress));

            // Check users collection for duplicates
            const emailSnapshotUsers = await getDocs(emailQueryUsers);
            const ethSnapshotUsers = await getDocs(ethQueryUsers);

            // Check registrations collection for duplicates
            const emailSnapshotRegistrations = await getDocs(emailQueryRegistrations);
            const ethSnapshotRegistrations = await getDocs(ethQueryRegistrations);

            // If email or ethAddress is already in either 'users' or 'registrations', show an alert
            if (!emailSnapshotUsers.empty || !ethSnapshotUsers.empty || !emailSnapshotRegistrations.empty || !ethSnapshotRegistrations.empty) {
                alert('This email or Ethereum address is already registered.');
                return;
            }

            // Save registration details to Firestore under 'registrations'
            await addDoc(collection(db, 'registrations'), {
                fullName,
                email,
                password, // Store password temporarily; consider hashing for security
                ethAddress,
                message,
                role,
                status: 'pending'
            });

            alert('Registration request sent!');
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-header">Sign Up</h2>
            <form onSubmit={handleRegister}>
                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="ethAddress">Eth-Address</label>
                    <input
                        type="text"
                        id="ethAddress"
                        placeholder="Eth-Address"
                        value={ethAddress}
                        readOnly
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="role">Role</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Employee">Employee</option>
                        <option value="Organization">Organization</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
                <div className="account-link">
                <p>Already have an account? <a href="/login">Sign in</a></p>
                </div>
        </div>
    );
};

export default Register;
