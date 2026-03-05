# Free Deployment Guide for Survey App

## Prerequisites
- GitHub account (to push your code)
- MongoDB Atlas account (free)
- Render account (free)
- Vercel account (free)

## Step 1: Set Up MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new project and cluster (free tier)
4. In "Network Access", add your IP address (or allow 0.0.0.0/0 for development)
5. Go to "Database Access" and create a database user
6. Click "Connect" and copy the MongoDB URI
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/survey-collection?retryWrites=true&w=majority`
7. Save this for later

## Step 2: Prepare Your Backend for Deployment

### Update your `server/package.json`:
Ensure PORT is configurable (already in your code - good!)

### Create `server/.env.example`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/survey-collection?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

## Step 3: Deploy Backend to Render (Free)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/survey.git
   git branch -M main
   git push -u origin main
   ```

2. Go to https://render.com and sign up with GitHub
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: survey-backend (or your choice)
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
6. Add Environment Variables:
   - Key: `MONGO_URI` → Value: (paste your MongoDB URI from Step 1)
   - Key: `NODE_ENV` → Value: `production`
7. Click "Create Web Service"
8. Wait for deployment (2-3 minutes)
9. Copy your backend URL (e.g., `https://survey-backend.onrender.com`)

## Step 4: Update Frontend to Connect to Deployed Backend

1. Update `client/package.json` - replace the proxy line:
   ```json
   "proxy": "https://survey-backend.onrender.com"
   ```
   OR set an environment variable

2. Better approach - create `client/.env.production`:
   ```
   REACT_APP_API_URL=https://survey-backend.onrender.com
   ```

3. Update `client/src/App.js` to use the environment variable:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   
   const fetchEntries = async () => {
     const res = await fetch(`${API_URL}/api/sources`);
     // ...
   };
   ```

## Step 5: Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project"
3. Select your GitHub repository
4. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `./client`
5. Add Environment Variables:
   - Key: `REACT_APP_API_URL` → Value: `https://survey-backend.onrender.com`
6. Click "Deploy"
7. Wait for deployment (1-2 minutes)
8. Your site is live!

## Important Notes

### Cold Start Prevention (NEW!)
The backend now includes automatic cold start prevention:

- A health check endpoint (`/health`) is available
- **On Render**: A cron job runs every 5 minutes to ping the server, keeping it warm
- **Setup**: The `node-cron` package handles this automatically when deployed to Render
- **Result**: Your server won't spin down, eliminating 30-second cold start delays

### Free Tier Limitations:
- **Render**: Free tier spins down after 15 minutes of inactivity ✅ MITIGATED BY CRON JOB
- **MongoDB Atlas**: 512 MB storage (plenty for a survey app)
- **Vercel**: Unlimited deployments, but limited build minutes per month

### Avoiding Sleep on Render:
If you want to avoid the 30-second cold start:
- Use Render's paid plans ($7/month)
- Or set up a cron job to ping your backend every 14 minutes using a service like https://kaffeine.herokuapp.com

## Testing Your Deployment

1. Visit your Vercel URL
2. Submit a test entry
3. Refresh the page - it should appear
4. Check MongoDB Atlas dashboard to see the record

## Troubleshooting

- **Backend not connecting to MongoDB**: Check MONGO_URI in Render environment variables
- **Frontend can't reach backend**: Verify REACT_APP_API_URL is correct
- **CORS errors**: Backend already has CORS enabled ✓
- **50-second timeout on Render**: This happens when backend is spinning up. Try again.

## Next Steps (Optional)

- Add more features to your survey
- Set up custom domain on Vercel
- Monitor your MongoDB Atlas usage
- Consider upgrading to paid tiers if usage exceeds free limits
