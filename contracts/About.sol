// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract About {
    struct UserProfile {
        string name;
        string location;
        string phoneNumber;
        string emailAddress;
        string personalSummary;
    }

    mapping(address => UserProfile) private profiles;

    function setProfile(
        string memory _name,
        string memory _location,
        string memory _phoneNumber,
        string memory _emailAddress,
        string memory _personalSummary
    ) public {
        profiles[msg.sender] = UserProfile(
            _name,
            _location,
            _phoneNumber,
            _emailAddress,
            _personalSummary
        );
    }

    function getProfile(address _user) public view returns (UserProfile memory) {
        return profiles[_user];
    }
}
