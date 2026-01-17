import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    harvestDate: {
        type: Date,
        required: true
    },
    owner: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    history: [{
        status: String,
        iotData: String,
        timestamp: Date,
        transactionHash: String
    }],
    blockchainTxHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
