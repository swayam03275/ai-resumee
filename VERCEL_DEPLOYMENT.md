# Vercel Monorepo Deployment Guide

## 🎯 Overview

This guide will help you deploy your Resume Builder as a **monorepo on Vercel**, with both frontend and backend running on the same domain.

**Architecture:**

- Frontend (React + Vite) → Vercel Static Site
- Backend (Node.js + Express) → Vercel Serverless Functions
- Database → MongoDB Atlas (cloud)

---

## ⚠️ Important Considerations

### File Uploads Limitation

Vercel serverless functions have **ephemeral storage** - files uploaded are deleted after the function execution. You have two options:

1. **Use Cloud Storage (Recommended for Production)**
   - Integrate Cloudinary, AWS S3, or Vercel Blob
   - Modify upload controllers to use cloud storage

2. **Keep Current Setup (OK for Testing)**
   - Uploads will work but files may be lost on re-deployment
   - Use this for testing the deployment first

---

## 📦 Step 1: Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. **Network Access**: Add `0.0.0.0/0` to allow connections from anywhere
5. Get your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/resume-builder?retryWrites=true&w=majority
   ```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Setup Vercel monorepo deployment"
   git push
   ```

2. **Go to [vercel.com](https://vercel.com) and login**

3. **Import your repository**
   - Click "Add New..." → "Project"
   - Select your repository
   - Click "Import"

4. **Configure the project**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as is, don't change)
   - **Build Command**: Leave default or set to `npm run build`
   - **Output Directory**: Leave default
   - **Install Command**: `npm install` or leave default

5. **Add Environment Variables** (Critical!)
   Click "Environment Variables" and add:

   | Name           | Value                                | Example                                           |
   | -------------- | ------------------------------------ | ------------------------------------------------- |
   | `MONGO_URL`    | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
   | `JWT_SECRET`   | A secure random string               | `your_super_secure_random_string_here`            |
   | `NODE_ENV`     | `production`                         | `production`                                      |
   | `FRONTEND_URL` | Leave empty or set after deployment  | `https://your-app.vercel.app`                     |

   **Generate JWT_SECRET**: Run this in terminal:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-5 minutes for deployment
   - You'll get a URL like: `https://your-app.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

When prompted:

- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** resume-builder (or your choice)
- **Directory:** `./` (root)
- **Override settings?** No

Then add environment variables:

```bash
vercel env add MONGO_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

---

## ✅ Step 3: Post-Deployment Configuration

### 1. Update CORS (if needed)

After first deployment, if you see CORS errors:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `FRONTEND_URL` with your Vercel URL
3. Redeploy

### 2. Test Your Deployment

Visit your Vercel URL and test:

- ✅ Homepage loads
- ✅ Sign up / Login works
- ✅ Dashboard loads
- ✅ Can create new resume
- ✅ Can edit resume
- ✅ Can download PDF
- ⚠️ Image uploads (may not persist on free tier)

---

## 🐛 Troubleshooting

### Issue: "CORS Error"

**Solution**:

- Check `FRONTEND_URL` is set correctly
- Try adding your specific Vercel domain to environment variables
- Redeploy after changing environment variables

### Issue: "Database Connection Failed"

**Solution**:

- Verify `MONGO_URL` is correct in Vercel environment variables
- Check MongoDB Atlas allows connections from `0.0.0.0/0`
- Verify database user credentials are correct

### Issue: "Cannot POST /api/auth/login"

**Solution**:

- Check the `vercel.json` routes configuration
- Ensure backend server.js exports the app for Vercel
- Check function logs in Vercel dashboard

### Issue: "Uploaded images not showing"

**Solution**:

- This is expected on Vercel serverless (ephemeral storage)
- Integrate cloud storage like Cloudinary (see below)

### Issue: "Function timeout"

**Solution**:

- Vercel free tier has 10s timeout for serverless functions
- Upgrade to Pro ($20/month) for 60s timeout
- Optimize database queries

---

## 📸 Step 4: Setup Cloud Storage for Images (Recommended)

### Using Cloudinary (Free tier: 25GB storage, 25GB bandwidth)

1. **Sign up at [cloudinary.com](https://cloudinary.com)**

2. **Get your credentials** from dashboard

3. **Install Cloudinary SDK**

   ```bash
   cd backend
   npm install cloudinary multer-storage-cloudinary
   ```

4. **Update backend environment variables** in Vercel:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. **Update `backend/middlewares/uploadMiddleware.js`:**

   ```javascript
   const cloudinary = require("cloudinary").v2;
   const { CloudinaryStorage } = require("multer-storage-cloudinary");
   const multer = require("multer");

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });

   const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
       folder: "resume-builder",
       allowed_formats: ["jpg", "png", "jpeg", "webp"],
     },
   });

   const upload = multer({ storage });
   module.exports = upload;
   ```

6. **Redeploy to Vercel**

---

## 🔄 Updating Your Deployment

### Update Frontend

```bash
# Make your changes
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys on push
```

### Update Backend

```bash
# Make your changes
git add .
git commit -m "Update backend API"
git push
# Vercel auto-deploys on push
```

### Update Environment Variables

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit or add variables
3. Redeploy: Deployments → ⋯ → Redeploy

---

## 📊 Monitoring & Logs

### View Logs

- Vercel Dashboard → Your Project → Deployments
- Click on latest deployment
- View "Functions" tab for backend logs
- View "Build Logs" for build issues

### Analytics

- Vercel Dashboard → Your Project → Analytics
- View traffic, performance, errors

---

## 💰 Costs

### Vercel Free Tier (Hobby)

- ✅ Unlimited websites
- ✅ 100GB bandwidth/month
- ✅ Serverless functions (10s timeout)
- ✅ Automatic HTTPS
- ⚠️ Commercial use not allowed

### Vercel Pro ($20/month)

- ✅ Commercial use allowed
- ✅ 1TB bandwidth
- ✅ 60s function timeout
- ✅ Team collaboration
- ✅ Advanced analytics

### Additional Services

- MongoDB Atlas: Free (512MB) or $9/month (2GB)
- Cloudinary: Free (25GB) or $99/month (more storage)

**Total Free Tier**: $0/month (testing/personal)
**Total Production**: $20-50/month (commercial use)

---

## ✨ Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all functionality
3. 🔄 Integrate Cloudinary for image uploads
4. 🎨 Add custom domain (Vercel Dashboard → Domains)
5. 📊 Setup analytics
6. 🔒 Add rate limiting for API endpoints
7. 🚀 Upgrade to Pro for commercial use

---

## 📝 Important Files Created

- `/vercel.json` - Vercel configuration for monorepo
- `/package.json` - Root package.json for monorepo
- `/.vercelignore` - Files to ignore during deployment
- `/frontend/resume/.env.production` - Production environment variables

---

## 🆘 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

## 🎉 You're Ready!

Your Resume Builder is now configured for Vercel monorepo deployment. Follow the steps above and you'll have your app live in minutes!
