// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Certification contract
  const Certification = await ethers.getContractFactory("Certification");
  const certification = await Certification.deploy();
  console.log("Waiting for Certification contract deployment...");
  await certification.waitForDeployment();
  console.log("Certification contract deployed to:", certification.target);

  // Deploy About contract
  const About = await ethers.getContractFactory("About");
  const about = await About.deploy();
  console.log("Waiting for About contract deployment...");
  await about.waitForDeployment();
  console.log("About contract deployed to:", about.target);

  // Deploy WorkExperience contract
  const WorkExperience = await ethers.getContractFactory("WorkExperience");
  const workExperience = await WorkExperience.deploy();
  console.log("Waiting for WorkExperience contract deployment...");
  await workExperience.waitForDeployment();
  console.log("WorkExperience contract deployed to:", workExperience.target);

  // Deploy OrgProfile contract
  const OrgProfile = await ethers.getContractFactory("OrgProfile");
  const orgProfile = await OrgProfile.deploy();
  console.log("Waiting for OrgProfile contract deployment...");
  await orgProfile.waitForDeployment();
  console.log("OrgProfile contract deployed to:", orgProfile.target);
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
