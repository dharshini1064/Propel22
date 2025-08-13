#!/bin/bash

# Bash script to prepare and deploy Propel22 to Render.com

echo -e "\n\033[1;36m===== Propel22 Render Deployment Helper =====\033[0m\n"

echo -e "\033[1;33mThis script will help you prepare your application for deployment to Render.com.\033[0m\n"

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo -e "\033[1;31mError: render.yaml not found in the current directory.\033[0m"
    echo -e "\033[1;31mPlease make sure you're running this script from the root of the Propel22 project.\033[0m"
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "\033[1;31mGit is not installed or not in your PATH. You'll need Git to deploy to Render.\033[0m"
    echo -e "\033[1;31mPlease install Git and try again.\033[0m"
    exit 1
fi

# Check if the current directory is a git repository
if [ ! -d ".git" ]; then
    echo -e "\033[1;33mThe current directory is not a Git repository.\033[0m"
    
    read -p "Would you like to initialize a Git repository? (y/n) " initRepo
    if [ "$initRepo" = "y" ]; then
        git init
        echo -e "\033[1;32mGit repository initialized.\033[0m"
    else
        echo -e "\033[1;33mYou'll need to push your code to a Git repository to deploy to Render.\033[0m"
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "\033[1;33mYou have uncommitted changes in your repository:\033[0m"
    git status
    
    read -p "Would you like to commit these changes? (y/n) " commitChanges
    if [ "$commitChanges" = "y" ]; then
        read -p "Enter a commit message: " commitMessage
        git add .
        git commit -m "$commitMessage"
        echo -e "\033[1;32mChanges committed.\033[0m"
    fi
fi

# Check if the repository has a remote
if [ -z "$(git remote)" ]; then
    echo -e "\033[1;33mYour repository doesn't have a remote configured.\033[0m"
    echo -e "\033[1;33mYou'll need to push your code to GitHub, GitLab, or Bitbucket to deploy to Render.\033[0m"
    
    echo -e "\n\033[1;36mPlease create a repository on GitHub, GitLab, or Bitbucket and then run:\033[0m"
    echo -e "git remote add origin YOUR_REPOSITORY_URL"
    echo -e "git push -u origin main"
fi

# Verify environment variables
echo -e "\n\033[1;36m===== Environment Variables Check =====\033[0m\n"

echo -e "\033[1;33mWhen deploying to Render, you'll need to set the following environment variables:\033[0m"
echo -e "- NODE_ENV: production"
echo -e "- JWT_SECRET: (a secure random string)"
echo -e "- PORT: 10000 (for the API service)"
echo -e "- DATABASE_URL: (will be automatically set when you create a PostgreSQL database in Render)"
echo -e "- REACT_APP_API_URL: (the URL of your API service, e.g., https://propel22-api.onrender.com)"

# Free tier information
echo -e "\n\033[1;36m===== Render Free Tier Information =====\033[0m\n"

echo -e "\033[1;33mRender offers a generous free tier for development and testing:\033[0m"
echo -e "- Static Sites: Always free with no time limitations"
echo -e "- Web Services: Free preview tier available"
echo -e "- PostgreSQL: Free instances available for 90 days"
echo -e "- Key-Value Stores: Free instances available"

echo -e "\n\033[1;33mTo create free instances:\033[0m"
echo -e "1. When creating services, make sure to select the 'Free' instance type"
echo -e "2. For detailed instructions, see CREATE_FREE_RENDER_INSTANCE.md"

# Provide deployment instructions
echo -e "\n\033[1;36m===== Deployment Instructions =====\033[0m\n"

echo -e "\033[1;33mTo deploy to Render:\033[0m"
echo -e "1. Create an account at https://render.com if you don't have one"
echo -e "2. Push your code to GitHub, GitLab, or Bitbucket"
echo -e "3. In the Render dashboard, click 'New' and select 'Blueprint'"
echo -e "4. Connect your repository"
echo -e "5. Render will automatically detect the render.yaml file and create the services"
echo -e "6. Click 'Apply' to start the deployment"

echo -e "\n\033[1;33mAlternatively, you can manually create each service as described in RENDER_DEPLOYMENT.md\033[0m"

echo -e "\n\033[1;36m===== Deployment Complete =====\033[0m\n"
echo -e "\033[1;32mFor more detailed instructions, please refer to RENDER_DEPLOYMENT.md\033[0m"