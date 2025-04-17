require('@nomicfoundation/hardhat-toolbox');

module.exports = {
    solidity: {
        version: "0.8.27",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200, // Optimized for deployments
            },
        },
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
    },
};
