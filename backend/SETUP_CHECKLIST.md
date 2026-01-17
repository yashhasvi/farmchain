# MongoDB Atlas Setup - Quick Checklist

## ✅ Step 1: Create Account
- [ ] Go to: https://www.mongodb.com/cloud/atlas/register
- [ ] Sign up with Google OR email
- [ ] Verify your email (if using email signup)
- [ ] Log in to MongoDB Atlas

## ✅ Step 2: Create Free Cluster
Once logged in:
- [ ] Click "Build a Database" or "Create"
- [ ] Choose **M0 FREE** tier (512 MB, no credit card)
- [ ] Select cloud provider (AWS recommended)
- [ ] Choose region closest to you
- [ ] Name: "Cluster0" (default is fine)
- [ ] Click "Create Cluster"
- [ ] Wait 1-3 minutes for creation

## ✅ Step 3: Create Database User
- [ ] You'll be prompted to create a user automatically
- [ ] OR: Click "Database Access" → "Add New Database User"
- [ ] Choose **Password** authentication
- [ ] Username: `farmchain-admin` (or your choice)
- [ ] Password: Click "Autogenerate Secure Password" (**SAVE THIS!**)
- [ ] Privileges: "Read and write to any database"
- [ ] Click "Add User"

**IMPORTANT:** Copy and save your password somewhere safe!

## ✅ Step 4: Configure Network Access
- [ ] Click "Network Access" in left sidebar
- [ ] Click "Add IP Address"
- [ ] Click "Allow Access from Anywhere" (for development)
- [ ] This adds `0.0.0.0/0` to whitelist
- [ ] Click "Confirm"

## ✅ Step 5: Get Connection String
- [ ] Go to "Database" (Overview)
- [ ] Click "Connect" button on your cluster
- [ ] Choose "Connect your application"
- [ ] Driver: **Node.js**
- [ ] Version: **6.10 or later**
- [ ] **COPY** the connection string

Example:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## ✅ Step 6: Update Backend Configuration

Replace in connection string:
- `<username>` → your database username
- `<password>` → your database password
- Add `/farmchain` before the `?`

Final format:
```
mongodb+srv://farmchain-admin:your_password@cluster0.xxxxx.mongodb.net/farmchain?retryWrites=true&w=majority
```

## ✅ Step 7: Update .env File

We'll update your `backend/.env` file with the connection string.

## ✅ Step 8: Restart Backend

We'll restart your backend server to connect to MongoDB.

## ✅ Step 9: Verify Connection

We'll check that everything is working!

---

## 📝 Notes

- **Free tier limits:** 512 MB storage (plenty for this project)
- **No credit card required**
- **Save your password!** You'll need it for the connection string
- **Network access:** `0.0.0.0/0` is fine for development, but restrict for production

---

## Need Help?

Just let me know when you:
- ✅ Created your account
- ✅ Have your connection string

And I'll help you update your backend configuration!
