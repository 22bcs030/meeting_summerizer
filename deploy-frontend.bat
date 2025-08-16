@echo off
REM Windows batch script for deploying the frontend

echo Deploying frontend to Vercel...
cd client

REM Make sure the build is up to date
call npm run build

REM Deploy using Vercel CLI (requires vercel CLI to be installed)
REM You'll need to run 'npm install -g vercel' first
REM And login with 'vercel login'
call vercel --prod

echo Frontend deployment completed!
