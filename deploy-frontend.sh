#!/usr/bin/env bash
# Deploy to Vercel

echo "Deploying frontend to Vercel..."
cd client

# Make sure the build is up to date
npm run build

# Deploy using Vercel CLI (requires vercel CLI to be installed)
# You'll need to run 'npm install -g vercel' first
# And login with 'vercel login'
vercel --prod

echo "Frontend deployment completed!"
