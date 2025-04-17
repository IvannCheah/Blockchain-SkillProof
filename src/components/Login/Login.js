import React, { useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ethAddress, setEthAddress] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check Firestore for the user's role and ethAddress in the 'users' collection
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                const storedEthAddress = userData.ethAddress;
                const role = userData.role;

                // Debug: Check if ethAddress and role are correctly fetched
                console.log('Fetched User Data:', userData);
                console.log('Stored Ethereum Address:', storedEthAddress);
                console.log('Connected Ethereum Address:', ethAddress);

                // Get the user's Ethereum address from MetaMask
                if (typeof window.ethereum !== 'undefined') {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const connectedEthAddress = accounts[0].toLowerCase(); // Normalize to lowercase

                    // Check if Ethereum address matches
                    if (connectedEthAddress !== storedEthAddress.toLowerCase()) {
                        alert('Ethereum address does not match the account');
                        return;
                    }

                    // Navigate based on user role
                    switch (role) {
                        case 'Admin':
                            navigate('/admin');
                            break;
                        case 'Employee':
                            navigate('/employee');
                            break;
                        case 'Organization':
                            navigate('/organization');
                            break;
                        default:
                            alert('No role assigned or invalid role');
                            break;
                    }
                } else {
                    alert('MetaMask is not installed');
                }
            } else {
                alert('User not found or not approved');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid login credentials');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-header">Sign In</h2> {/* Added Sign In header */}
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Login</button>
            </form>
            <div className="account-link">
                <p>Need an account? <a href="/register">Sign up</a></p>
            </div>
        </div>
    );
};

export default Login;
