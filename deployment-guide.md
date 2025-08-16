# Meeting Notes Summarizer - Deployment Guide

This document provides instructions for deploying both the frontend and backend of the Meeting Notes Summarizer application.

## Backend Deployment (Render)

1. Create a new account on [Render](https://render.com/) if you don't have one.

2. Create a new Web Service:
   - Connect your GitHub repository
   - Select the repository and branch
   - Configure the service:
     - Name: `meeting-notes-summarizer-api`
     - Environment: `Node`
     - Build Command: `./build.sh` (ensure this file is in the root directory)
     - Start Command: `cd server && npm start`
     - Select the appropriate instance type (Free tier works for testing)

3. Add the following environment variables:
   - `PORT`: 10000 (Render uses this port internally)
   - `MONGODB_URI`: Your MongoDB connection string
   - `AI_API_KEY`: Your OpenAI API key
   - `EMAIL_SERVICE`: Email service provider (e.g., gmail)
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email app password
   - `FRONTEND_URL`: URL of your frontend after deployment
   - `NODE_ENV`: production

4. Deploy the service.

## Frontend Deployment (Vercel)

1. Create a new account on [Vercel](https://vercel.com/) if you don't have one.

2. Install the Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

3. Deploy from the CLI (optional):
   ```bash
   cd client
   vercel
   ```

4. Or deploy through the Vercel dashboard:
   - Connect to your GitHub repository
   - Import the project
   - Configure the build settings:
     - Framework Preset: Create React App
     - Build Command: `npm run build`
     - Output Directory: `build`
   
5. Set environment variables:
   - `REACT_APP_API_URL`: The URL of your backend API (e.g., https://meeting-notes-summarizer-api.onrender.com/api)

6. Deploy the application.

## Update API URLs

After deployment, make sure to:

1. Update the `REACT_APP_API_URL` in the frontend to point to your deployed backend
2. Update the `FRONTEND_URL` in the backend to allow requests from your deployed frontend

## Testing the Deployment

1. Visit your frontend URL
2. Try to create a new summary
3. Test the email sharing functionality

## Troubleshooting

If you encounter issues:
- Check the logs in both Render and Vercel
- Verify that all environment variables are correctly set
- Ensure the MongoDB connection is working
- Test the OpenAI API key
- Verify email service credentials
