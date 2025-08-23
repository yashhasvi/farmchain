// TODO COMMENT: Insert your contract address and ABI JSON here
export const CONTRACT_CONFIG = {
  address: "0xc6A0601CC5207102C574fE78A7c0B7eC461478f9",
  abi: [
    {
      "inputs": [
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "uint256", "name": "quantity", "type": "uint256" },
        { "internalType": "uint256", "name": "harvestDate", "type": "uint256" }
      ],
      "name": "createProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
        { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "harvestDate", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
      ],
      "name": "ProductCreated",
      "type": "event"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "productId", "type": "uint256" }
      ],
      "name": "getProductHistory",
      "outputs": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "uint256", "name": "quantity", "type": "uint256" },
        { "internalType": "uint256", "name": "harvestDate", "type": "uint256" },
        { "internalType": "address", "name": "owner", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" }
      ],
      "name": "getProductsByOwner",
      "outputs": [
        { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextProductId",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "", "type": "address" },
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "name": "ownerToProducts",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "name": "products",
      "outputs": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "uint256", "name": "quantity", "type": "uint256" },
        { "internalType": "uint256", "name": "harvestDate", "type": "uint256" },
        { "internalType": "address", "name": "owner", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

// Avalanche Fuji Testnet Configuration


export const AVALANCHE_FUJI = {
  chainId: '0xA869', // 43113 in hex
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
};