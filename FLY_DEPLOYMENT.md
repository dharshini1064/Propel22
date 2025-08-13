# Fly.io Deployment Guide for Propel22

This guide will help you deploy the Propel22 application to Fly.io, which offers a generous free tier including a PostgreSQL database.

## Prerequisites

1. **Fly.io Account**: Sign up at [fly.io](https://fly.io)
2. **Fly CLI**: Install the Fly CLI tool
   - On macOS: `brew install flyctl`
   - On Linux: `curl -L https://fly.io/install.sh | sh`
   - On Windows with PowerShell: `iwr https://fly.io/install.ps1 -useb | iex`
3. **Git**: Make sure Git is installed
4. **GitHub Account**: For CI/CD integration (optional)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is ready for deployment. The repository already includes:
- A `Dockerfile` for containerization
- A `fly.toml` configuration file
- Deployment scripts (`deploy-to-fly.sh` for Linux/Mac and `deploy-to-fly.ps1` for Windows)

### 2. Deploy to Fly.io

#### Using the Deployment Script (Recommended)

**For Linux/Mac users:**
```bash
chmod +x deploy-to-fly.sh
./deploy-to-fly.sh
```

**For Windows users:**
```powershell
.\deploy-to-fly.ps1
```

The script will guide you through:
- Creating a new app on Fly.io
- Setting up a PostgreSQL database
- Configuring environment variables
- Deploying your application

#### Manual Deployment

If you prefer to deploy manually, follow these steps:

1. **Log in to Fly.io**:
   ```bash
   flyctl auth login
   ```

2. **Launch your app** (first time only):
   ```bash
   flyctl launch --no-deploy
   ```

3. **Create a PostgreSQL database**:
   ```bash
   flyctl postgres create --name propel22-db
   ```

4. **Attach the database to your app**:
   ```bash
   flyctl postgres attach --app your-app-name propel22-db
   ```

5. **Set environment variables**:
   ```bash
   flyctl secrets set JWT_SECRET="your-secret-key" JWT_EXPIRES_IN="7d"
   ```

6. **Deploy your application**:
   ```bash
   flyctl deploy
   ```

### 3. Verify Deployment

1. **Check deployment status**:
   ```bash
   flyctl status
   ```

2. **Open your application**:
   ```bash
   flyctl open
   ```

## Troubleshooting

### Database Connection Issues

If your application cannot connect to the database:

1. Verify that the database is running:
   ```bash
   flyctl postgres status -a propel22-db
   ```

2. Check that the `DATABASE_URL` environment variable is set correctly:
   ```bash
   flyctl secrets list
   ```

3. Ensure SSL configuration is correct in your database connection code.

### Application Crashes

If your application crashes on startup:

1. Check the logs:
   ```bash
   flyctl logs
   ```

2. Verify all required environment variables are set:
   ```bash
   flyctl secrets list
   ```

### CORS Issues

If you experience CORS issues:

1. Make sure your CORS configuration in `server/index.js` is correctly set up
2. Verify that your client is using the correct API URL

## Free Tier Limitations

Fly.io's free tier includes:
- 3 shared-cpu-1x 256mb VMs
- 3GB of persistent volume storage
- 160GB outbound data transfer

This is sufficient for small to medium applications with moderate traffic.

## Maintenance

### Scaling

To scale your application (note: scaling beyond the free tier will incur costs):

```bash
flyctl scale count 2  # Increase to 2 instances
flyctl scale vm shared-cpu-1x  # Change VM size
```

### Monitoring

1. View logs:
   ```bash
   flyctl logs
   ```

2. Monitor metrics:
   ```bash
   flyctl metrics
   ```

### Updates

To update your application after code changes:

```bash
flyctl deploy
```

## GitHub Actions CI/CD Integration

We've set up GitHub Actions to automatically deploy your application to Fly.io whenever you push changes to your GitHub repository.

### Setup Steps

1. **Create a Fly API Token**:
   ```bash
   flyctl auth token
   ```

2. **Add the token to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add a new repository secret named `FLY_API_TOKEN` with the value of your Fly API token

3. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add Fly.io deployment configuration"
   git push origin main
   ```

The GitHub Actions workflow (`.github/workflows/fly-deploy.yml`) will automatically deploy your application to Fly.io whenever you push to the main branch.

For more detailed instructions, see [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md).

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io Postgres Documentation](https://fly.io/docs/postgres/)
- [Fly.io Pricing](https://fly.io/docs/about/pricing/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)