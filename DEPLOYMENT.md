# VukaLink Deployment Guide

This guide covers deploying VukaLink to various platforms and environments.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment experience with automatic builds and environment variable management.

#### Prerequisites
- Vercel account
- GitHub/GitLab repository with your code
- Supabase project configured

#### Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from your project directory
   vercel
   ```

2. **Configure Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Automatic Deployments**
   - Push to your main branch to trigger automatic deployments
   - Vercel will automatically build and deploy your changes

#### Vercel Configuration
Create a `vercel.json` file in your project root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Netlify

#### Steps
1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add your Supabase credentials

4. **Redirects**
   Create a `_redirects` file in your `public` folder:
   ```
   /*    /index.html   200
   ```

### 3. GitHub Pages

#### Steps
1. **Add GitHub Actions**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
           env:
             VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
             VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Configure Repository**
   - Go to Settings > Pages
   - Set source to "GitHub Actions"

3. **Add Secrets**
   - Go to Settings > Secrets and variables > Actions
   - Add your environment variables

## 🐳 Docker Deployment

### Dockerfile
Create a `Dockerfile` in your project root:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  vukalink:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Build and Run
```bash
# Build the image
docker build -t vukalink .

# Run with Docker Compose
docker-compose up -d

# Or run directly
docker run -p 80:80 vukalink
```

## ☁️ Cloud Platform Deployments

### AWS Amplify
1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect your Git repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add your Supabase credentials in the Amplify Console

### Google Cloud Run
1. **Create Dockerfile** (use the one above)
2. **Build and Deploy**
   ```bash
   # Build the image
   gcloud builds submit --tag gcr.io/PROJECT_ID/vukalink

   # Deploy to Cloud Run
   gcloud run deploy vukalink \
     --image gcr.io/PROJECT_ID/vukalink \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Azure Static Web Apps
1. **Install Azure CLI**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. **Deploy**
   ```bash
   # Login to Azure
   az login

   # Deploy
   swa deploy dist
   ```

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional: Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id

# Optional: Sentry for error tracking
VITE_SENTRY_DSN=your_sentry_dsn
```

### Environment-Specific Builds
```bash
# Development
npm run dev

# Staging
npm run build:staging

# Production
npm run build:production
```

Add to `package.json`:
```json
{
  "scripts": {
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production"
  }
}
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate keys regularly

### CORS Configuration
Configure your Supabase project:
1. Go to Settings > API
2. Add your domain to allowed origins
3. Configure CORS policies

### Content Security Policy
Add to your HTML or nginx config:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://*.supabase.co;">
```

## 📊 Monitoring and Analytics

### Performance Monitoring
- Use Vercel Analytics or similar
- Monitor Core Web Vitals
- Set up error tracking (Sentry)

### Health Checks
Create a health check endpoint or use static file:
```bash
# Test if your app is responding
curl -I https://your-domain.com/
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Loading**
   - Check if variables are properly set in your platform
   - Ensure they start with `VITE_`
   - Restart your deployment

3. **Routing Issues**
   - Ensure your platform supports SPA routing
   - Configure redirects to `index.html`

4. **CORS Errors**
   - Update Supabase CORS settings
   - Check your domain is in allowed origins

### Debug Mode
Enable debug logging:
```javascript
// In your main.jsx
if (import.meta.env.DEV) {
  console.log('Environment:', import.meta.env.MODE);
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
}
```

## 📈 Performance Optimization

### Build Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Caching Strategy
- Cache static assets aggressively
- Use service worker for offline support
- Implement proper cache headers

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

This deployment guide covers the most common scenarios. Choose the platform that best fits your needs and follow the specific instructions for that platform.