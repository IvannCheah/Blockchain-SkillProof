// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WorkExperience {
    struct Experience {
        string jobTitle;
        string companyName;
        address companyEthAddress;
        string startDate;
        string endDate; // Can be empty or "Present" if still in role
        string description;
        bool validated;
    }

    mapping(address => Experience[]) private experiences;
    mapping(address => uint256) private reputationScores;
    
    // Store all employee addresses who have submitted experiences
    address[] private employeeAddresses;

    event ExperienceAdded(
        address indexed user,
        string jobTitle,
        string companyName,
        address companyEthAddress,
        string startDate,
        string endDate,
        string description,
        bool validated
    );

    event ValidationRequested(
        address indexed user,
        address indexed companyEthAddress,
        uint256 experienceIndex
    );

    event ReputationAssigned(
        address indexed user,
        uint256 reputationScore
    );

    // Function to add work experience
    function addExperience(
        string memory _jobTitle,
        string memory _companyName,
        address _companyEthAddress,
        string memory _startDate,
        string memory _endDate,
        string memory _description
    ) public {
        Experience memory newExperience = Experience({
            jobTitle: _jobTitle,
            companyName: _companyName,
            companyEthAddress: _companyEthAddress,
            startDate: _startDate,
            endDate: bytes(_endDate).length == 0 ? "Present" : _endDate,
            description: _description,
            validated: false
        });

        experiences[msg.sender].push(newExperience);
        uint256 experienceIndex = experiences[msg.sender].length - 1;

        // Add user to the employeeAddresses list if not already added
        bool isEmployeeExist = false;
        for (uint256 i = 0; i < employeeAddresses.length; i++) {
            if (employeeAddresses[i] == msg.sender) {
                isEmployeeExist = true;
                break;
            }
        }

        if (!isEmployeeExist) {
            employeeAddresses.push(msg.sender);
        }

        emit ExperienceAdded(
            msg.sender,
            _jobTitle,
            _companyName,
            _companyEthAddress,
            _startDate,
            newExperience.endDate,
            _description,
            false
        );

        if (_companyEthAddress != address(0)) {
            emit ValidationRequested(msg.sender, _companyEthAddress, experienceIndex);
        }
    }

    // Function to get all work experiences of a user
    function getExperiences(address user) public view returns (Experience[] memory) {
        return experiences[user];
    }

    // Function to validate work experience and assign reputation points
    function validateExperience(address user, uint256 experienceIndex) public {
        require(experienceIndex < experiences[user].length, "Invalid experience index");
        Experience storage exp = experiences[user][experienceIndex];
        require(exp.companyEthAddress == msg.sender, "Not authorized to validate this experience");

        exp.validated = true;

        // Assign 50 reputation points to the user after validation
        assignReputation(user, 50);

        emit ReputationAssigned(user, reputationScores[user]);
    }

    // Function to assign reputation points to a user
    function assignReputation(address user, uint256 score) private {
        reputationScores[user] += score;
    }

    // Function to get reputation score of a user
    function getReputationScore(address user) public view returns (uint256) {
        return reputationScores[user];
    }

    // Function to get all employee addresses who have submitted experiences
    function getAllEmployeeAddresses() public view returns (address[] memory) {
        return employeeAddresses;
    }
}
