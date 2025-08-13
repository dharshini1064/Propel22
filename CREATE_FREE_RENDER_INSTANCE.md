# Creating a Free Render Instance for Propel22

This guide walks you through the process of creating free instances on Render.com for your Propel22 application.

## Overview of Render's Free Tier

Render offers free instances for several service types, making it perfect for development, testing, and hobby projects:

- **Static Sites**: Always free with no time limitations
- **Web Services**: Free preview tier for Node.js, Python, Rails, etc.
- **PostgreSQL Databases**: Free instances available for 90 days
- **Key-Value Stores**: Free instances available for testing

## Step-by-Step Guide

### 1. Create a Render Account

1. Visit [Render.com](https://render.com/)
2. Click "Sign Up" in the top right corner
3. Sign up with GitHub, GitLab, or email

### 2. Connect Your Repository

1. From the Render dashboard, click "New +" button
2. Select "Blueprint" from the dropdown menu
3. Connect your GitHub or GitLab account if not already connected
4. Select your Propel22 repository

### 3. Deploy Using Blueprint (Automated Setup)

Render will automatically detect the `render.yaml` file in your repository and suggest creating the following services:

1. **propel22-api**: Node.js web service
2. **propel22-client**: Static site
3. **propel22-db**: PostgreSQL database

Review the suggested services and click "Apply" to start the deployment.

### 4. Creating Free Instances Manually

If you prefer to set up services individually or the Blueprint option doesn't work:

#### A. Create a Free Web Service

1. From the Render dashboard, click "New +" button
2. Select "Web Service"
3. Connect your repository
4. Configure the service:
   - Name: `propel22-api`
   - Environment: `Node`
   - Region: Choose the closest to your location
   - Branch: `main` (or your default branch)
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - **Important**: Select "Free" instance type
5. Click "Create Web Service"

#### B. Create a Free PostgreSQL Database

1. From the Render dashboard, click "New +" button
2. Select "PostgreSQL"
3. Configure the database:
   - Name: `propel22-db`
   - Database: `propel22`
   - User: `propel22`
   - Region: Choose the same region as your web service
   - **Important**: Select "Free" instance type
4. Click "Create Database"

#### C. Create a Free Static Site

1. From the Render dashboard, click "New +" button
2. Select "Static Site"
3. Connect your repository
4. Configure the site:
   - Name: `propel22-client`
   - Branch: `main` (or your default branch)
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
   - **Important**: Static sites are always free on Render
5. Click "Create Static Site"

### 5. Connect Your Services

After creating your services, you need to connect them:

1. Go to your `propel22-api` web service
2. Navigate to the "Environment" tab
3. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (generate a secure random string)
   - `PORT`: `10000`
   - `DATABASE_URL`: (copy from your PostgreSQL database's "Connect" tab)
4. Click "Save Changes"

5. Go to your `propel22-client` static site
6. Navigate to the "Environment" tab
7. Add the environment variable:
   - `REACT_APP_API_URL`: (URL of your API service, e.g., `https://propel22-api.onrender.com`)
8. Click "Save Changes"

### 6. Verify Your Deployment

1. Wait for all services to deploy (this may take a few minutes)
2. Access your client application at the URL provided by Render (e.g., `https://propel22-client.onrender.com`)
3. Test the application functionality to ensure everything is working correctly

## Understanding Free Tier Limitations

- **Web Services**: Free for preview/testing, will spin down after inactivity
- **PostgreSQL**: Free for 90 days, limited storage (1GB)
- **Static Sites**: Always free with no time limitations
- **Usage Limits**: Free instances count against your monthly included allotments of outbound bandwidth and pipeline minutes

## Monitoring Your Usage

1. From the Render dashboard, click on your account name in the top right
2. Select "Billing"
3. View your current usage and limits

## Tips for Free Tier Usage

1. **Prevent Spin-down**: For development purposes, you can use services like [UptimeRobot](https://uptimerobot.com/) to ping your web service every few minutes to prevent it from spinning down
2. **Optimize Build Times**: Minimize your build times to conserve pipeline minutes
3. **Database Backups**: Regularly back up your database data as free tier databases have a 90-day limit
4. **Monitor Usage**: Keep an eye on your bandwidth usage to avoid exceeding free tier limits

## Next Steps

Once you've verified your free instance is working correctly, you can:

1. Set up a custom domain (available even for free instances)
2. Configure automatic deployments from your GitHub/GitLab repository
3. Share your application URL with others for testing and feedback

For production use, consider upgrading to paid plans when your application is ready for a wider audience.