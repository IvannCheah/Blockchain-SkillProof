import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './CreateUser.css';

const CreateUser = () => {
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        ethAddress: '',
        message: '',
        role: '',
    });

    const fetchRegistrations = async () => {
        const querySnapshot = await getDocs(collection(db, 'registrations'));
        const registrationData = [];
        querySnapshot.forEach((doc) => {
            registrationData.push({ id: doc.id, ...doc.data() });
        });
        setRegistrations(registrationData);
    };

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userData = [];
        querySnapshot.forEach((doc) => {
            userData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(userData);
    };

    useEffect(() => {
        fetchRegistrations();
        fetchUsers();
    }, []);

    const handleApprove = async (id, fullName, email, password, ethAddress, message, role) => {
        const registrationRef = doc(db, 'registrations', id);

        try {
            await createUserWithEmailAndPassword(auth, email, password);

            const userRef = collection(db, 'users');
            await addDoc(userRef, {
                fullName,
                email,
                ethAddress,
                message,
                role,
                status: 'active',
            });

            await deleteDoc(registrationRef);

            alert('User approved!');
            fetchRegistrations();
            fetchUsers();
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Error approving user. Please try again.');
        }
    };

    const handleDecline = async (id) => {
        const registrationRef = doc(db, 'registrations', id);

        try {
            await deleteDoc(registrationRef);
            alert('User declined.');
            fetchRegistrations();
        } catch (error) {
            console.error('Error declining user:', error);
            alert('Error declining user. Please try again.');
        }
    };

    const handleCreateUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleCreateUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);

            const userRef = collection(db, 'users');
            await addDoc(userRef, {
                fullName: newUser.fullName,
                email: newUser.email,
                ethAddress: newUser.ethAddress,
                message: newUser.message,
                role: newUser.role,  // Ensure the role is included here
                status: 'active',
            });

            setShowModal(false);
            alert('User created!');
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again.');
        }
    };

    return (
        <div className="create-user-page">
            <div className="create-user-container">
                <h1>Register Requests</h1>
                <button className="create-user-btn" onClick={() => setShowModal(true)}><span>+</span> Create User</button>
                <div className="registrations-container">
                    {registrations.map((reg) => (
                        <div key={reg.id} className="registration-card">
                            <div className="registration-detail"><strong>Full Name:</strong> {reg.fullName}</div>
                            <div className="registration-detail"><strong>Email:</strong> {reg.email}</div>
                            <div className="registration-detail"><strong>Ethereum Address:</strong> {reg.ethAddress}</div>
                            <div className="registration-detail"><strong>Message:</strong> {reg.message}</div>
                            <div className="registration-detail"><strong>Role:</strong> {reg.role}</div>
                            <div className="registration-detail"><strong>Status:</strong> {reg.status}</div>
                            {reg.status === 'pending' && (
                                <div className="registration-actions">
                                    <button className="approve-btn" onClick={() => handleApprove(reg.id, reg.fullName, reg.email, reg.password, reg.ethAddress, reg.message, reg.role)}>Approve</button>
                                    <button className="decline-btn" onClick={() => handleDecline(reg.id)}>Decline</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="registered-users-container">
                <h2>Registered Users</h2>
                <div className="users-container">
                    {users.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-detail"><strong>Full Name:</strong> {user.fullName}</div>
                            <div className="user-detail"><strong>Email:</strong> {user.email}</div>
                            <div className="user-detail"><strong>Ethereum Address:</strong> {user.ethAddress}</div>
                            <div className="user-detail"><strong>Message:</strong> {user.message}</div>
                            <div className="user-detail"><strong>Role:</strong> {user.role}</div>
                            <div className="user-detail"><strong>Status:</strong> {user.status}</div>
                        </div>
                    ))}
                </div>
            </div>
    
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        <h3>Create User</h3>
                        <form onSubmit={handleCreateUserSubmit}>
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={newUser.fullName}
                                onChange={handleCreateUserChange}
                                required
                            />
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleCreateUserChange}
                                required
                            />
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleCreateUserChange}
                                required
                            />
                            <label htmlFor="ethAddress">Ethereum Address</label>
                            <input
                                type="text"
                                id="ethAddress"
                                name="ethAddress"
                                value={newUser.ethAddress}
                                onChange={handleCreateUserChange}
                                required
                            />
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={newUser.message}
                                onChange={handleCreateUserChange}
                            ></textarea>
                            <label htmlFor="role">Role</label>
                            <select id="role" name="role" value={newUser.role} onChange={handleCreateUserChange}>
                                <option value="Employee">Employee</option>
                                <option value="Admin">Admin</option>
                                <option value="Organization">Organization</option>
                            </select>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );    
};

export default CreateUser;
