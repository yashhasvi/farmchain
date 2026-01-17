import express from 'express';
import {
    getProductById,
    getProductsByOwner,
    syncProductFromBlockchain,
    getAllProducts
} from '../controllers/productController.js';

const router = express.Router();

// Get all products (for testing)
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get products by owner address
router.get('/owner/:address', getProductsByOwner);

// Sync product from blockchain
router.post('/sync/:id', syncProductFromBlockchain);

export default router;
