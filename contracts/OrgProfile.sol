// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrgProfile {
    struct Organization {
        string companyName;
        string companyEthAddress;
        string emailAddress;
        string websiteURL;
        string slogan;
    }

    mapping(address => Organization) private organizations;
    address[] private organizationAddresses;

    function setProfile(
        string memory _companyName,
        string memory _companyEthAddress,
        string memory _emailAddress,
        string memory _websiteURL,
        string memory _slogan
    ) public {
        organizations[msg.sender] = Organization(
            _companyName,
            _companyEthAddress,
            _emailAddress,
            _websiteURL,
            _slogan
        );
        organizationAddresses.push(msg.sender);
    }

    function getProfile(address orgAddress) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory
    ) {
        Organization memory org = organizations[orgAddress];
        return (
            org.companyName,
            org.companyEthAddress,
            org.emailAddress,
            org.websiteURL,
            org.slogan
        );
    }

    function getAllOrganizations() public view returns (address[] memory) {
        return organizationAddresses;
    }
}
