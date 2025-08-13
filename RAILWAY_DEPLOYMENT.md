# Railway Deployment Guide for Propel22

## Overview

This guide provides detailed instructions for deploying the Propel22 application to Railway, including setting up the database and resolving common issues.

## Prerequisites

- Railway account (sign up at [Railway.app](https://railway.app/))
- Git repository with the latest Propel22 code
- Basic understanding of Node.js and PostgreSQL

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has the following files:

- `railway.json` - Configuration file for Railway
- `Procfile` - Defines process types and startup commands
- Updated database connection code that supports the `DATABASE_URL` environment variable

### 2. Create a New Project in Railway

1. Log in to your Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your Propel22 repository
5. Railway will automatically detect the configuration and start the deployment

### 3. Add PostgreSQL Database

1. In your project dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Wait for the database to be provisioned

### 4. Link Services

Railway will automatically link your web service to the PostgreSQL database, but you should verify:

1. Go to your web service in Railway
2. Navigate to the "Variables" tab
3. Confirm that `DATABASE_URL` is set and contains the connection string to your PostgreSQL database

### 5. Configure Environment Variables

Add the following environment variables to your web service:

```
NODE_ENV=production
JWT_SECRET=your_secure_random_string
PORT=5000
```

### 6. Deploy and Monitor

1. Railway will automatically deploy your application when you push changes to your repository
2. Monitor the deployment logs for any issues
3. If you encounter database connection errors, check:
   - The `DATABASE_URL` environment variable is correctly set
   - Your application code properly handles the connection string
   - SSL settings are properly configured in your Sequelize setup

### 7. Access Your Application

1. Once deployed, go to the "Settings" tab of your web service
2. Click "Generate Domain" to get a public URL
3. Your application will be available at the generated domain

## Troubleshooting

### Database Connection Issues

If you see "Database connection failed" in the logs:

1. Verify that the `DATABASE_URL` environment variable is correctly set in Railway
2. Check that your application code properly handles the connection string format
3. Ensure SSL is properly configured in your Sequelize setup:

```javascript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

### Application Crashes

If your application crashes immediately after deployment:

1. Check the logs for error messages
2. Verify that all required environment variables are set
3. Make sure your `Procfile` and `railway.json` are correctly configured
4. Test your application locally with similar environment variables

### CORS Issues

If users from certain locations cannot access the site:

1. Verify that the CORS configuration in `server/index.js` is correctly set to allow all origins
2. Check browser console logs for CORS-related errors

## Maintenance

### Updating the Application

1. Make changes to your local codebase
2. Push changes to GitHub
3. Railway will automatically deploy the changes

### Monitoring

1. Use Railway's built-in logs to monitor application performance
2. Set up alerts for critical errors

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize Documentation](https://sequelize.org/master/)
- [Express.js Documentation](https://expressjs.com/)