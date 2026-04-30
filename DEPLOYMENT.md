# Deployment Guide for Netlify

This guide will help you deploy your event discovery app to Netlify.

## ✅ Prerequisites

### Get a Maptiler API Key (Free)

1. **Sign up at Maptiler**: https://www.maptiler.com/cloud/
2. **Free tier includes**: 100,000 map loads per month
3. **Copy your API key** from the dashboard

### Other Services (No API Key Needed)

- Geocoding uses Nominatim (free, no API key required)
- Address autocomplete works out of the box

## 🔑 Setup API Key

### For Local Development

1. **Create a `.env` file** in your project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your Maptiler API key**:
   ```env
   VITE_MAPTILER_API_KEY=your_actual_api_key_here
   ```

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

The map should now load with the beautiful Maptiler style!

### For Netlify Deployment

You need to add the API key as an environment variable in Netlify:

1. **Go to your Netlify site dashboard**
2. **Navigate to**: Site settings → Environment variables
3. **Click**: "Add a variable"
4. **Add**:
   - Key: `VITE_MAPTILER_API_KEY`
   - Value: Your Maptiler API key
5. **Save** and redeploy your site

## 🚀 Deploy to Netlify

### Option 1: Deploy via Netlify CLI

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. Follow the prompts:
   - Choose "Create & configure a new site"
   - Select your team
   - Enter a site name (or leave blank for random)
   - Publish directory: `dist`

### Option 2: Deploy via Netlify Dashboard

1. **Build your app locally**:
   ```bash
   npm run build
   ```

2. **Go to Netlify Dashboard**:
   - Visit https://app.netlify.com
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder

### Option 3: Connect to Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider
   - Select your repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

## 🔧 Netlify Configuration

Create a `netlify.toml` file in your project root (optional but recommended):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures client-side routing works correctly.

## ✨ Features That Work on Netlify

✅ **Map Display** - Beautiful Maptiler vector tiles
✅ **Address Geocoding** - Uses Nominatim API (free, no key needed)
✅ **Address Autocomplete** - Works everywhere
✅ **All Interactive Features** - Join, leave, create, edit events
✅ **Responsive Design** - Mobile and desktop
✅ **Real-time Updates** - State management with Zustand
✅ **Custom Markers** - Airbnb-style with dynamic colors

## 🌐 Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your site settings in Netlify
2. Click "Domain management"
3. Click "Add custom domain"
4. Follow the DNS configuration instructions

## 🔍 Troubleshooting

### Map Not Loading?

**Check API Key:**
- Verify `VITE_MAPTILER_API_KEY` is set in Netlify environment variables
- Make sure the key is valid (test at https://cloud.maptiler.com/)
- Redeploy after adding environment variables

**Check Browser Console:**
- Look for 401 errors (invalid API key)
- Look for 403 errors (rate limit exceeded)
- Check network tab for failed tile requests

**Local Development:**
- Ensure `.env` file exists in project root
- Verify API key is correct in `.env`
- Restart dev server after changing `.env`

### Routing Issues?
- Make sure `netlify.toml` is in your project root
- The redirect rule ensures all routes work correctly

### Build Fails?
- Check Node.js version (should be 18+)
- Run `npm install` to ensure all dependencies are installed
- Try `npm run build` locally first

## 📊 Performance Tips

1. **Enable Netlify's Asset Optimization**:
   - Go to Site settings → Build & deploy → Post processing
   - Enable "Bundle CSS" and "Minify JS"

2. **Enable HTTPS**:
   - Automatically enabled by Netlify
   - Force HTTPS in domain settings

3. **Add Headers** (optional):
   Create `public/_headers`:
   ```
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
   ```

## 🎉 You're Done!

Your app should now be live on Netlify with:
- Working map with OpenStreetMap
- Address geocoding and autocomplete
- All interactive features
- Fast global CDN delivery
- Automatic HTTPS

Share your Netlify URL and enjoy! 🚀