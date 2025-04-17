import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole, getUsersBySearch } from '../../firebaseConfig';
import './Navbar.css';

const Navbar = ({ ethAddress }) => {
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to handle dropdown visibility
  const navigate = useNavigate(); // Add useNavigate for navigation

  useEffect(() => {
    const fetchUserRole = async () => {
      if (ethAddress) {
        try {
          const role = await getUserRole(ethAddress);
          setUserRole(role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
    if (ethAddress) {
      fetchUserRole();
    }
  }, [ethAddress]);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      try {
        const results = await getUsersBySearch(e.target.value);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    navigate('/login'); // Redirect to login page
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); // Toggle dropdown visibility
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">SkillProof</Link>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for employees or organizations..."
        />
      </div>
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(result => (
            <Link to={`/profile/${result.ethAddress}`} key={result.ethAddress} className="search-result-item">
              <p>{result.fullName}</p>
              <p className="eth-address">{result.ethAddress}</p>
            </Link>
          ))}
        </div>
      )}
      {userRole === 'Employee' && (
        <nav className="role-nav">
          <ul>
            <li><Link to="/employee">Home</Link></li>
            <li><Link to="/employee/profile">Profile</Link></li>
            <li><Link to="/employee/leaderboard">Leaderboard</Link></li>
          </ul>
        </nav>
      )}
      {userRole === 'Admin' && (
        <nav className="role-nav">
          <ul>
            <li><Link to="/admin">Home</Link></li>
            <li><Link to="/admin/createuser">Create User</Link></li>
            <li><Link to="/admin/certvalidate">Certificate Validation</Link></li>
            <li><Link to="/admin/leaderboard">Leaderboard</Link></li>
          </ul>
        </nav>
      )}
      {userRole === 'Organization' && (
        <nav className="role-nav">
          <ul>
            <li><Link to="/organization">Home</Link></li>
            <li><Link to="/organization/orgprofile">Profile</Link></li>
            <li><Link to="/organization/workexpvalidate">Work Experience Validation</Link></li>
            <li><Link to="/organization/leaderboard">Leaderboard</Link></li>
          </ul>
        </nav>
      )}
      <div className="user-info">
        <div className="user-type">{userRole || 'Loading role...'}</div>
        <div className="eth-address">
          <button onClick={toggleDropdown} className="eth-address-link">
            {ethAddress}
          </button>
          {dropdownVisible && (
            <div className="dropdown-content">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
