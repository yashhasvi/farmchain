import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ABI = [
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
    }
];

class BlockchainService {
    constructor() {
        this.provider = null;
        this.contract = null;
        this.initialize();
    }

    initialize() {
        try {
            // Initialize provider
            this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);

            // Initialize contract (read-only)
            this.contract = new ethers.Contract(
                process.env.CONTRACT_ADDRESS,
                CONTRACT_ABI,
                this.provider
            );

            console.log('✅ Blockchain service initialized');
        } catch (error) {
            console.error('❌ Failed to initialize blockchain service:', error);
        }
    }

    async getProductFromBlockchain(productId) {
        try {
            const product = await this.contract.getProductHistory(productId);

            return {
                id: product.id.toString(),
                name: product.name,
                quantity: product.quantity.toString(),
                harvestDate: new Date(Number(product.harvestDate) * 1000),
                owner: product.owner.toLowerCase()
            };
        } catch (error) {
            console.error(`Error fetching product ${productId} from blockchain:`, error);
            throw error;
        }
    }

    async getProductsByOwner(ownerAddress) {
        try {
            const productIds = await this.contract.getProductsByOwner(ownerAddress);
            return productIds.map(id => id.toString());
        } catch (error) {
            console.error(`Error fetching products for owner ${ownerAddress}:`, error);
            throw error;
        }
    }

    // Listen for ProductCreated events
    listenForProductCreation(callback) {
        if (!this.contract) {
            console.error('Contract not initialized');
            return;
        }

        this.contract.on('ProductCreated', (id, name, quantity, harvestDate, owner, event) => {
            console.log('📦 New product created on blockchain:', {
                id: id.toString(),
                name,
                quantity: quantity.toString(),
                owner
            });

            callback({
                productId: id.toString(),
                name,
                quantity: quantity.toString(),
                harvestDate: new Date(Number(harvestDate) * 1000),
                owner: owner.toLowerCase(),
                transactionHash: event.log.transactionHash
            });
        });

        console.log('🎧 Listening for ProductCreated events...');
    }
}

export default new BlockchainService();
