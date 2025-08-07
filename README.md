
# uPrayers Deployment Guide

## 🌐 Backend (Render)
1. Go to https://render.com
2. Create new Web Service
3. Use `/server` folder as root
4. Set environment variable:
   - OPENAI_API_KEY = your OpenAI key
5. Deploy and copy your backend URL

## 💻 Frontend (Vercel)
1. Go to https://vercel.com
2. Create new project
3. Use `/client` as the project root
4. Update your React app's fetch URL to point to the Render backend
5. Deploy and test

## 🌍 Connect Domain (GoDaddy)
1. In Vercel, go to project → Settings → Domains
2. Add your domain (uPrayers.com)
3. Copy DNS settings to GoDaddy DNS manager
4. Wait for it to propagate (may take 10–15 minutes)
