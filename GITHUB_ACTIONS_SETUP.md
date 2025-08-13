# Setting Up GitHub Actions for Fly.io Deployment

This guide will help you set up GitHub Actions to automatically deploy your Propel22 application to Fly.io whenever you push changes to your GitHub repository.

## Prerequisites

1. A GitHub repository for your Propel22 project
2. A Fly.io account with the application already set up
3. Fly.io CLI installed locally (for initial setup)

## Steps to Configure GitHub Actions

### 1. Create a Fly API Token

First, you need to create a Fly API token that GitHub Actions can use to deploy your application:

```bash
flyctl auth token
```

This command will output an API token. Copy this token as you'll need it in the next step.

### 2. Add the Fly API Token to GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click on "New repository secret"
4. Name: `FLY_API_TOKEN`
5. Value: Paste the token you copied in step 1
6. Click "Add secret"

### 3. GitHub Actions Workflow File

We've already created a GitHub Actions workflow file at `.github/workflows/fly-deploy.yml` with the following content:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Build client
        run: cd client && npm run build
      
      - name: Setup Flyctl
        uses: superfly/flyctl-actions/setup-flyctl@master
      
      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

This workflow will:
1. Trigger on pushes to the `main` branch or manual dispatch
2. Set up Node.js v16
3. Install dependencies
4. Build the client
5. Set up the Fly CLI
6. Deploy to Fly.io using the API token

### 4. Push the Workflow File to GitHub

When you push your changes to GitHub, make sure to include the workflow file:

```bash
git add .github/workflows/fly-deploy.yml
git commit -m "Add GitHub Actions workflow for Fly.io deployment"
git push origin main
```

## Testing the Workflow

After pushing the workflow file to GitHub, you can test it by:

1. Making a small change to your code
2. Committing and pushing the change to the `main` branch
3. Going to the "Actions" tab in your GitHub repository to monitor the workflow

Alternatively, you can manually trigger the workflow:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Deploy to Fly.io" workflow
3. Click on "Run workflow" > "Run workflow"

## Troubleshooting

### Workflow Fails with Authentication Error

If you see an error like "Error: Could not authenticate with Fly API":

1. Check that the `FLY_API_TOKEN` secret is correctly set in your repository
2. Generate a new token with `flyctl auth token` and update the secret

### Deployment Fails

If the deployment fails but authentication works:

1. Check the workflow logs for specific error messages
2. Ensure your `fly.toml` file is correctly configured
3. Try deploying manually with `flyctl deploy` to see if you encounter the same issues

## Customizing the Workflow

### Deploying to Different Environments

You can modify the workflow to deploy to different environments based on the branch:

```yaml
on:
  push:
    branches:
      - main
      - staging
```

Then use conditional steps to deploy to different Fly.io apps:

```yaml
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: flyctl deploy --app your-production-app --remote-only
  env:
    FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

- name: Deploy to Staging
  if: github.ref == 'refs/heads/staging'
  run: flyctl deploy --app your-staging-app --remote-only
  env:
    FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Adding Tests Before Deployment

You can add testing steps before deployment:

```yaml
- name: Run tests
  run: npm test
```

## Conclusion

With GitHub Actions configured, your Propel22 application will automatically deploy to Fly.io whenever you push changes to your GitHub repository. This streamlines your development workflow and ensures your production environment stays up-to-date with your latest code changes.