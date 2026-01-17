# MongoDB Atlas Setup Guide

This guide will help you set up a free MongoDB database for your FarmChain application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google/GitHub account
3. Complete the registration process

## Step 2: Create a Free Cluster

1. After logging in, click **"Create"** or **"Build a Database"**
2. Choose **"M0 FREE"** tier (512 MB storage, no credit card required)
3. Select a cloud provider and region (choose one closest to you):
   - AWS, Google Cloud, or Azure
   - Recommended: Same region as your users
4. Name your cluster (default: "Cluster0" is fine)
5. Click **"Create Cluster"**
6. Wait 1-3 minutes for the cluster to be created

## Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password
   - **IMPORTANT**: Save these credentials securely!
   - Username example: `farmchain-admin`
   - Password: Generate a strong password
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Configure Network Access

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to the IP whitelist
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go back to **"Database"** (Overview)
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose:
   - Driver: **Node.js**
   - Version: **6.10 or later**
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Backend Configuration

1. Open the `.env` file in your `backend` directory
2. Replace the placeholder with your connection string:
   ```
   MONGODB_URI=mongodb+srv://farmchain-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/farmchain?retryWrites=true&w=majority
   ```
3. Replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - Add `/farmchain` before the `?` to specify the database name

### Example:
```env
PORT=4000
MONGODB_URI=mongodb+srv://farmchain-admin:MySecurePass123@cluster0.abc123.mongodb.net/farmchain?retryWrites=true&w=majority
BLOCKCHAIN_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0xc6A0601CC5207102C574fE78A7c0B7eC461478f9
```

## Step 7: Test Connection

1. Restart your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Look for this message:
   ```
   ✅ MongoDB connected successfully
   ```

3. Verify database connection:
   ```bash
   curl http://localhost:4000/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "database": "connected"
   }
   ```

## Step 8: View Your Data

1. In MongoDB Atlas, click **"Browse Collections"**
2. Select your database: `farmchain`
3. You'll see collections created automatically:
   - `products` - All product data

## Troubleshooting

### Connection Timeout
- **Problem**: "MongoNetworkError: connection timeout"
- **Solution**: Check Network Access whitelist includes your IP

### Authentication Failed
- **Problem**: "MongoServerError: Authentication failed"
- **Solution**: Verify username and password in connection string

### Database Not Found
- **Problem**: Database doesn't appear
- **Solution**: Database is created automatically when first data is inserted

### Special Characters in Password
- **Problem**: Connection fails with special characters
- **Solution**: URL-encode special characters:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - Or create a new password without special characters

## MongoDB Atlas Free Tier Limits

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 maximum
- **Clusters**: 1 per project
- **Backups**: Not included
- **Support**: Community forums

**This is more than enough for development and small-scale production!**

## Next Steps

Once connected, your backend will automatically:
- ✅ Sync products from blockchain to database
- ✅ Cache data for faster queries
- ✅ Listen for blockchain events
- ✅ Serve data via REST API

## Alternative: Local MongoDB (Optional)

If you prefer running MongoDB locally:

1. Install MongoDB Community Edition
2. Start MongoDB: `mongod`
3. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/farmchain
   ```

**Not recommended for production or team collaboration.**
