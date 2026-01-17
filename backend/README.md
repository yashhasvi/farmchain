# FarmChain Backend

Backend API server for FarmChain supply chain tracking application.

## Features

- RESTful API for product management
- MongoDB database integration
- Avalanche blockchain integration
- Real-time event listening from smart contracts
- Automatic data syncing between blockchain and database

## Prerequisites

- Node.js v16 or higher
- MongoDB Atlas account (free tier) or local MongoDB
- Access to Avalanche Fuji Testnet

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
PORT=4000
MONGODB_URI=your_mongodb_connection_string_here
BLOCKCHAIN_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0xc6A0601CC5207102C574fE78A7c0B7eC461478f9
```

### 3. Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `your_mongodb_connection_string_here` in `.env`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/farmchain?retryWrites=true&w=majority
```

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 5. Verify Server is Running

Visit: http://localhost:4000/health

You should see:
```json
{
  "status": "ok",
  "message": "FarmChain backend is running",
  "timestamp": "...",
  "database": "connected"
}
```

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Products
- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get product by ID
- **GET** `/api/products/owner/:address` - Get products by owner address
- **POST** `/api/products/sync/:id` - Sync product from blockchain to database

## How It Works

1. **Frontend** → Creates product via smart contract
2. **Smart Contract** → Emits `ProductCreated` event on blockchain
3. **Backend** → Listens for events and syncs to MongoDB
4. **Database** → Caches product data for fast queries
5. **API** → Serves product data to frontend

## Blockchain-Only Mode

If MongoDB is not configured, the backend will run in blockchain-only mode:
- API endpoints will fetch data directly from blockchain
- No data caching
- Slower response times
- Still fully functional

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### Blockchain Connection Issues
- Verify RPC URL is accessible
- Check contract address is correct
- Ensure Avalanche Fuji network is operational

## Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Blockchain**: Ethers.js
- **Environment**: Node.js ES Modules
