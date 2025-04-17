// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certification {

    struct Certificate {
        string courseName;
        string issueDate;
        string issuer;
        bool validated;
        string certType;
        string ipfsHash; // Add IPFS hash to store file
    }

    struct Employee {
        uint256 reputationScore;
        Certificate[] certificates;
    }

    mapping(address => Employee) public employees;
    address[] public employeeAddresses;
    mapping(string => uint256) public certificateScores;
    address public admin;

    constructor() {
        admin = msg.sender;
        certificateScores["Basic Certificate"] = 10;
        certificateScores["Intermediate Certificate"] = 20;
        certificateScores["Advanced Certificate"] = 30;
        certificateScores["Professional Certificate"] = 50;
    }

    function submitCertificate(string memory courseName, string memory issueDate, string memory issuer, string memory certType, string memory ipfsHash) public {
        require(certificateScores[certType] > 0, "Invalid certificate type");

        Certificate memory newCert = Certificate(courseName, issueDate, issuer, false, certType, ipfsHash);
        employees[msg.sender].certificates.push(newCert);

        if (employees[msg.sender].certificates.length == 1) {
            employeeAddresses.push(msg.sender);
        }
    }

    function validateCertificate(address user, uint index) public {
        require(msg.sender == admin, "Only admin can validate certificates");
        require(index < employees[user].certificates.length, "Invalid certificate index");

        Certificate storage cert = employees[user].certificates[index];
        require(!cert.validated, "Certificate is already validated");

        cert.validated = true;
        employees[user].reputationScore += certificateScores[cert.certType];
    }

    function getCertificates(address user) public view returns (Certificate[] memory) {
        return employees[user].certificates;
    }

    function getReputationScore(address user) public view returns (uint256) {
        return employees[user].reputationScore;
    }

    function updateCertificateScore(string memory certType, uint256 score) public {
        require(msg.sender == admin, "Only admin can update certificate scores");
        certificateScores[certType] = score;
    }

    function getAllEmployeeAddresses() public view returns (address[] memory) {
        return employeeAddresses;
    }
}
