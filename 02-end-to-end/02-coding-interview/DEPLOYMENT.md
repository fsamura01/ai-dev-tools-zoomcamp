# Deploying to Render (Manual Web Service)

Since the project is in a subdirectory (`module02/02-coding-interview`), we'll use the manual Web Service approach instead of Blueprint.

## Step-by-Step Instructions

### 1. Go to Render Dashboard
Visit [https://dashboard.render.com/](https://dashboard.render.com/) and log in.

### 2. Create a New Web Service
- Click **New +** in the top right
- Select **Web Service**

### 3. Connect Your Repository
- Click **Connect account** if you haven't connected GitHub yet
- Find and select your repository: `fsamura01/ai-dev-tools-zoomcamp`
- Click **Connect**

### 4. Configure the Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `coding-interview-platform` (or any unique name) |
| **Root Directory** | `module02/02-coding-interview` |
| **Environment** | `Docker` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Instance Type** | `Free` |

### 5. Advanced Settings (Optional)

Under **Advanced**, you can verify:
- **Docker Command**: Leave empty (uses Dockerfile's CMD)
- **Docker Context**: Leave as `./` (relative to root directory)

### 6. Deploy

- Click **Create Web Service**
- Render will:
  1. Clone your repository
  2. Navigate to `module02/02-coding-interview`
  3. Build the Docker image using your `Dockerfile`
  4. Start the container
  5. Assign you a public URL like `https://coding-interview-platform-xxxx.onrender.com`

### 7. Monitor the Build

- You'll see the build logs in real-time
- The first build takes ~3-5 minutes
- Once you see `Server listening on port 3000`, it's live!

### 8. Access Your App

- Click the URL at the top of the page
- Your collaborative coding interview platform is now live! 🎉

## Important Notes

⚠️ **Free Tier Limitations:**
- The service will spin down after 15 minutes of inactivity
- First request after sleeping takes 30-60 seconds to wake up
- In-memory sessions will be lost when the service restarts

💡 **Upgrade to Starter ($7/mo) if you need:**
- Always-on service (no sleeping)
- Persistent sessions (until you add Redis/database)
- Faster performance

## Troubleshooting

**Build fails?**
- Check the build logs for errors
- Verify `Dockerfile` is in `module02/02-coding-interview/`
- Ensure Root Directory is set correctly

**Can't connect?**
- Wait for the build to complete (green "Live" badge)
- Check if port 3000 is exposed in Dockerfile (it is)
- Try accessing the health endpoint: `https://your-app.onrender.com/health`

**WebSockets not working?**
- Render supports WebSockets by default on all plans
- Ensure you're using `https://` (not `http://`) in production
