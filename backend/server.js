import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import blockchainService from './services/blockchain.js';
import Product from './models/Product.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'FarmChain backend is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API routes
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Database connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI || mongoURI === 'your_mongodb_connection_string_here') {
            console.log('⚠️  MongoDB URI not configured. Running in blockchain-only mode.');
            console.log('💡 To enable database features:');
            console.log('   1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas');
            console.log('   2. Get your connection string');
            console.log('   3. Create a .env file in the backend directory');
            console.log('   4. Add: MONGODB_URI=your_connection_string');
            return false;
        }

        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');

        // Listen for blockchain events and sync to database
        blockchainService.listenForProductCreation(async (productData) => {
            try {
                await Product.findOneAndUpdate(
                    { productId: productData.productId },
                    {
                        ...productData,
                        blockchainTxHash: productData.transactionHash
                    },
                    { upsert: true, new: true }
                );
                console.log(`✅ Product ${productData.productId} synced to database`);
            } catch (error) {
                console.error('Error syncing product to database:', error);
            }
        });

        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('⚠️  Running in blockchain-only mode');
        return false;
    }
};

// Start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log('');
        console.log('🚀 ====================================');
        console.log(`🚀 FarmChain Backend Server Running`);
        console.log(`🚀 Port: ${PORT}`);
        console.log(`🚀 Health: http://localhost:${PORT}/health`);
        console.log(`🚀 API: http://localhost:${PORT}/api/products`);
        console.log('🚀 ====================================');
        console.log('');
    });
};

startServer();

export default app;
