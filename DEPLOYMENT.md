# Propel22 Deployment Guide

## Overview

This guide provides instructions for deploying the Propel22 application to Railway, including setting up the database and resolving common issues.

## Prerequisites

- Railway account
- Git installed
- Node.js and npm installed

## Deployment Steps

### 1. Push Changes to GitHub

All changes have been pushed to GitHub. The repository is now up-to-date with the latest fixes for:
- Partners section blank screen issue
- CORS configuration for access from all locations
- Improved deployment configuration with health checks

### 2. Set Up Database in Railway

The application is currently failing to connect to the database. To fix this:

1. Log in to your Railway dashboard
2. Navigate to your Propel22 project
3. Add a PostgreSQL database service:
   - Click "+ New Service"
   - Select "Database" → "PostgreSQL"
   - Wait for the database to be provisioned

4. Link the database to your application:
   - Go to your API service in Railway
   - Navigate to the "Variables" tab
   - Add the following environment variables with values from the Railway PostgreSQL service:
     ```
     DB_HOST=<Railway PostgreSQL host>
     DB_USER=<Railway PostgreSQL username>
     DB_PASSWORD=<Railway PostgreSQL password>
     DB_NAME=<Railway PostgreSQL database name>
     DB_PORT=5432
     ```
   - Click "Save Variables"

5. Restart your API service:
   - Go to your API service
   - Click "Deploy" to redeploy with the new environment variables

### 3. Verify the Deployment

1. Once the deployment is complete, check the logs to ensure the database connection is successful
2. Open your application URL
3. Test the Partners section to ensure it's working correctly
4. Verify that users from all locations (including Bangalore) can access the site

### 4. Troubleshooting

#### Database Connection Issues

If you see "Database connection failed" in the logs:

1. Verify that the environment variables are correctly set in Railway
2. Check that the PostgreSQL service is running
3. Ensure the API service has access to the PostgreSQL service

#### CORS Issues

If users from certain locations cannot access the site:

1. Verify that the CORS configuration in `server/index.js` is correctly set
2. Check browser console logs for CORS-related errors

#### Partners Section Issues

If the Partners section is still blank:

1. Check browser console logs for API errors
2. Verify that the API endpoint `/api/partners` is returning data
3. Ensure the client-side code in `PartnerList.js` is correctly rendering the data

## Maintenance

### Updating the Application

1. Make changes to the codebase
2. Push changes to GitHub
3. Railway will automatically deploy the changes (if GitHub integration is set up)

### Monitoring

1. Use Railway's built-in logs to monitor application performance
2. Set up alerts for critical errors

## Local Development
```bash
npm run install-all
npm run dev
```

## Production Build
```bash
npm run build
npm start
```

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)