# Render Deployment Guide for Propel22

## Overview

This guide provides detailed instructions for deploying the Propel22 application to Render.com, a cloud platform that offers free hosting for web services, static sites, and databases.

## Prerequisites

- Render account (sign up at [Render.com](https://render.com/))
- Git repository with the latest Propel22 code
- Basic understanding of Node.js and PostgreSQL

## Deployment Steps

### 1. Prepare Your Repository

Your repository already contains the necessary `render.yaml` file which defines the services for Render deployment. This file includes:

- API service configuration
- Client service configuration
- PostgreSQL database configuration

### 2. Deploy to Render

#### Option 1: Blueprint Deployment (Recommended)

1. Log in to your Render dashboard
2. Click "New" and select "Blueprint"
3. Connect your GitHub/GitLab account if not already connected
4. Select your Propel22 repository
5. Render will automatically detect the `render.yaml` file and create the services defined in it
6. Click "Apply" to start the deployment

#### Option 2: Manual Deployment

If you prefer to set up services manually:

1. **Deploy the API Service**:
   - In your Render dashboard, click "New" and select "Web Service"
   - Connect your repository
   - Name: `propel22-api`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `JWT_SECRET`: (generate a secure random string)
     - `PORT`: `10000`

2. **Create a PostgreSQL Database**:
   - Click "New" and select "PostgreSQL"
   - Name: `propel22-db`
   - User: `propel22`
   - Database: `propel22`
   - After creation, copy the internal connection string

3. **Add Database URL to API Service**:
   - Go to your API service
   - Add environment variable: `DATABASE_URL` with the value of your database connection string

4. **Deploy the Client Service**:
   - Click "New" and select "Static Site"
   - Connect your repository
   - Name: `propel22-client`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
   - Add environment variable: `REACT_APP_API_URL` with the value of your API service URL (e.g., `https://propel22-api.onrender.com`)

### 3. Verify Deployment

1. Wait for all services to deploy (this may take a few minutes)
2. Access your client application at the URL provided by Render (e.g., `https://propel22-client.onrender.com`)
3. Test the application functionality to ensure everything is working correctly

## Troubleshooting

### Database Connection Issues

If you see database connection errors in the logs:

1. Verify that the `DATABASE_URL` environment variable is correctly set in your API service
2. Check that your application code properly handles the connection string format
3. Ensure SSL is properly configured in your database connection code:

```javascript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

### Build Failures

If your build fails:

1. Check the build logs for specific error messages
2. Verify that all dependencies are correctly specified in your package.json files
3. Ensure that your build commands are correct for your project structure

### CORS Issues

If you encounter CORS errors:

1. Verify that the CORS configuration in `server/index.js` is correctly set to allow requests from your client domain
2. Add your client domain to the allowed origins list if necessary

## Maintenance

### Updating the Application

1. Make changes to your local codebase
2. Push changes to your repository
3. Render will automatically deploy the changes (if auto-deploy is enabled)

### Monitoring

1. Use Render's built-in logs to monitor application performance
2. Set up custom domains and SSL certificates for production use

## Free Tier Benefits

Render offers a generous free tier that's perfect for testing and development:

### Free Services

- **Static Sites**: Always free with no time limitations
- **Web Services**: Free preview tier for Node.js, Python, Rails, etc.
- **PostgreSQL Databases**: Free instances available
- **Key-Value Stores**: Free instances available

### Usage Limits

- Free instances count against your monthly included allotments of outbound bandwidth and pipeline minutes
- You can monitor your usage in the Render Dashboard

### Perfect For

- Testing out new technologies
- Working on hobby projects
- Previewing Render's developer experience
- Development and staging environments

### Limitations

- Free web services and databases will spin down after periods of inactivity
- Cold starts may be slower when services need to spin up
- Not recommended for production applications
- Some services have time-limited free trials (90 days)

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render PostgreSQL Documentation](https://render.com/docs/databases)
- [Render YAML Blueprint Specification](https://render.com/docs/blueprint-spec)
- [Render Pricing](https://render.com/pricing)