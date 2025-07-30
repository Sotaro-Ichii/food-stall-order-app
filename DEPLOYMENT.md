# Deployment Guide

## GitHub Setup

1. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it something like `food-stall-order-management`
   - Don't initialize with README (we already have one)

2. **Connect your local project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Food Stall Order Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Vercel Deployment

### Method 1: Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com)**
   - Sign up/login with your GitHub account

2. **Import your project**
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Configure build settings** (should be auto-detected):
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (enter your preferred name)
# - Directory? ./
# - Override settings? No
```

## Environment Variables (If needed in future)

If you need to add environment variables:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add your variables

2. **In Vercel CLI:**
   ```bash
   vercel env add VARIABLE_NAME
   ```

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch will trigger automatic deployment
- Pull requests will create preview deployments
- You can see deployment status in GitHub and Vercel dashboard

## Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to project settings
   - Navigate to "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

## Monitoring

- **Vercel Analytics**: Available in project dashboard
- **Function Logs**: View in Vercel dashboard under "Functions" tab
- **Performance**: Monitor Core Web Vitals in Vercel dashboard

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation locally: `npm run build`

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify Firebase configuration
- Ensure all environment variables are set

### Performance Issues
- Use Vercel Analytics to identify bottlenecks
- Optimize images and assets
- Consider code splitting for large applications