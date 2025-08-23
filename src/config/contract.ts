// TODO COMMENT: Insert your contract address and ABI JSON here
export const CONTRACT_CONFIG = {
  // Replace with your deployed contract address on Avalanche Fuji Testnet
  address: "0x1552cFe3fB72F46b462e29dB83d20b86f7e2E7D1",
  
  // TODO COMMENT: Replace this with your actual contract ABI
  abi: [
    // Example ABI - replace with your actual contract ABI
    "function createProduct(string memory name, uint256 quantity, uint256 harvestDate) external returns (uint256)",
    "function addUpdate(uint256 productId, string memory status, string memory iotData) external",
    "function getProductHistory(uint256 productId) external view returns (tuple(uint256 id, string name, uint256 quantity, uint256 harvestDate, string[] statuses, string[] iotData, uint256[] timestamps))",
    "function getProductsByOwner(address owner) external view returns (uint256[])",
    "event ProductCreated(uint256 indexed productId, address indexed owner, string name)",
    "event ProductUpdated(uint256 indexed productId, string status, string iotData)"
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