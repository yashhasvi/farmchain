import Product from '../models/Product.js';
import blockchainService from '../services/blockchain.js';

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // First, try to get from database
        let product = await Product.findOne({ productId: id });

        // If not in database, fetch from blockchain
        if (!product) {
            console.log(`Product ${id} not in database, fetching from blockchain...`);
            const blockchainProduct = await blockchainService.getProductFromBlockchain(id);

            // Return blockchain data without saving (for now)
            return res.json({
                id: blockchainProduct.id,
                name: blockchainProduct.name,
                owner: blockchainProduct.owner,
                quantity: blockchainProduct.quantity,
                harvestDate: blockchainProduct.harvestDate,
                history: []
            });
        }

        // Return database product
        res.json({
            id: product.productId,
            name: product.name,
            owner: product.owner,
            quantity: product.quantity,
            harvestDate: product.harvestDate,
            history: product.history || []
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            error: 'Failed to fetch product',
            message: error.message
        });
    }
};

// Get products by owner address
export const getProductsByOwner = async (req, res) => {
    try {
        const { address } = req.params;

        // Get product IDs from blockchain
        const productIds = await blockchainService.getProductsByOwner(address);

        // Fetch each product's details
        const products = await Product.find({
            productId: { $in: productIds }
        });

        res.json(products.map(p => ({
            id: p.productId,
            name: p.name,
            owner: p.owner,
            quantity: p.quantity,
            harvestDate: p.harvestDate,
            createdAt: p.createdAt
        })));
    } catch (error) {
        console.error('Error fetching products by owner:', error);
        res.status(500).json({
            error: 'Failed to fetch products',
            message: error.message
        });
    }
};

// Sync product from blockchain to database
export const syncProductFromBlockchain = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch from blockchain
        const blockchainProduct = await blockchainService.getProductFromBlockchain(id);

        // Save or update in database
        const product = await Product.findOneAndUpdate(
            { productId: id },
            {
                productId: blockchainProduct.id,
                name: blockchainProduct.name,
                quantity: blockchainProduct.quantity,
                harvestDate: blockchainProduct.harvestDate,
                owner: blockchainProduct.owner,
                blockchainTxHash: 'synced',
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({
            message: 'Product synced successfully',
            product: {
                id: product.productId,
                name: product.name,
                owner: product.owner
            }
        });
    } catch (error) {
        console.error('Error syncing product:', error);
        res.status(500).json({
            error: 'Failed to sync product',
            message: error.message
        });
    }
};

// Get all products (for testing)
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).limit(50);
        res.json(products.map(p => ({
            id: p.productId,
            name: p.name,
            owner: p.owner,
            quantity: p.quantity,
            harvestDate: p.harvestDate,
            createdAt: p.createdAt
        })));
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({
            error: 'Failed to fetch products',
            message: error.message
        });
    }
};
