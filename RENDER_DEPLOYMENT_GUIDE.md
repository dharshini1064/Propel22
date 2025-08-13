# Render Deployment Guide for Propel22

This guide provides step-by-step instructions for deploying the Propel22 application to Render using the Blueprint method.

## Prerequisites

- A Render account (sign up at https://render.com if you don't have one)
- Your Propel22 codebase (with the render.yaml file)
- A GitHub repository containing your Propel22 code

## Deployment Steps

### 1. Push Your Code to GitHub

Ensure your code is pushed to a GitHub repository:

```bash
# Initialize git repository if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/propel22.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Render using Blueprint

1. Log in to your Render account
2. Click on the "New +" button and select "Blueprint"
3. Connect your GitHub account if not already connected
4. Select the repository containing your Propel22 code
5. Render will automatically detect the `render.yaml` file and configure your services
6. Click "Apply" to start the deployment process

### 3. Monitor Deployment

- Render will create three services as defined in your `render.yaml` file:
  - propel22-api: Node.js web service for your backend
  - propel22-client: Static site for your frontend
  - propel22-db: PostgreSQL database

- You can monitor the build and deployment progress in the Render dashboard

### 4. Access Your Application

Once deployment is complete, you can access your application at:
- Frontend: https://propel22-client.onrender.com
- Backend API: https://propel22-api.onrender.com

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Check the environment variables in the Render dashboard for your API service
2. Ensure `DATABASE_URL` is correctly linked to your database
3. Verify that your database service is running

### Build Failures

If your build fails:

1. Check the build logs in the Render dashboard
2. Ensure all dependencies are correctly specified in package.json
3. Verify that your build commands in render.yaml are correct

### Frontend Not Connecting to Backend

If your frontend cannot connect to the backend:

1. Check the `REACT_APP_API_URL` environment variable in the Render dashboard
2. Ensure it's set to `https://propel22-api.onrender.com`
3. Rebuild the client service if needed

## Maintenance

### Updating Your Application

To update your application:

1. Make changes to your code locally
2. Commit and push to GitHub
3. Render will automatically deploy the changes

### Scaling

If you need to scale your application:

1. Go to the service in the Render dashboard
2. Click on "Settings"
3. Update the plan as needed

## Support

If you need further assistance, refer to the [Render documentation](https://render.com/docs) or contact Render support.