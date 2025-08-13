#!/bin/bash

# Propel22 Fly.io Deployment Script
echo "\033[0;32m===== Propel22 Fly.io Deployment Script =====\033[0m"

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "\033[0;31mError: flyctl is not installed.\033[0m"
    echo "Please install the Fly CLI first:"
    echo "  - On macOS: brew install flyctl"
    echo "  - On Linux: curl -L https://fly.io/install.sh | sh"
    echo "  - On Windows with PowerShell: iwr https://fly.io/install.ps1 -useb | iex"
    exit 1
fi

# Check if user is logged in
flyctl auth whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "\033[0;33mYou need to log in to Fly.io first.\033[0m"
    flyctl auth login
fi

echo "\033[0;32m\nStep 1: Launching the application on Fly.io\033[0m"
echo "This will create a new app on Fly.io using the configuration in fly.toml"
echo "\033[0;33mNote: If you've already created the app, you can skip this step.\033[0m"

read -p "Do you want to create a new app on Fly.io? (y/n): " create_app
if [ "$create_app" = "y" ]; then
    flyctl launch --no-deploy
    echo "\033[0;32mApp created successfully!\033[0m"
fi

echo "\033[0;32m\nStep 2: Creating a PostgreSQL database\033[0m"
echo "This will create a free PostgreSQL database for your application"
echo "\033[0;33mNote: If you've already created a database, you can skip this step.\033[0m"

read -p "Do you want to create a new PostgreSQL database? (y/n): " create_db
if [ "$create_db" = "y" ]; then
    read -p "Enter a name for your database (e.g., propel22-db): " db_name
    flyctl postgres create --name $db_name --region dfw
    
    echo "\033[0;32mDatabase created successfully!\033[0m"
    echo "\033[0;33mNow you need to attach the database to your app.\033[0m"
    
    read -p "Enter your app name (from fly.toml): " app_name
    flyctl postgres attach --app $app_name $db_name
    
    echo "\033[0;32mDatabase attached successfully!\033[0m"
fi

echo "\033[0;32m\nStep 3: Setting environment variables\033[0m"
echo "Setting up required environment variables for your application"

read -p "Do you want to set environment variables now? (y/n): " set_env
if [ "$set_env" = "y" ]; then
    read -p "Enter your JWT_SECRET (or press Enter to generate one): " jwt_secret
    
    if [ -z "$jwt_secret" ]; then
        jwt_secret=$(openssl rand -base64 32)
        echo "Generated JWT_SECRET: $jwt_secret"
    fi
    
    read -p "Enter your app name (from fly.toml): " app_name
    
    # Set environment variables
    flyctl secrets set JWT_SECRET="$jwt_secret" --app $app_name
    flyctl secrets set JWT_EXPIRES_IN="7d" --app $app_name
    
    echo "\033[0;32mEnvironment variables set successfully!\033[0m"
fi

echo "\033[0;32m\nStep 4: Deploying your application\033[0m"
echo "This will deploy your application to Fly.io"

read -p "Do you want to deploy your application now? (y/n): " deploy_app
if [ "$deploy_app" = "y" ]; then
    flyctl deploy
    
    echo "\033[0;32mDeployment initiated!\033[0m"
fi

echo "\033[0;32m\nStep 5: Checking deployment status\033[0m"
read -p "Do you want to check the status of your deployment? (y/n): " check_status
if [ "$check_status" = "y" ]; then
    read -p "Enter your app name (from fly.toml): " app_name
    flyctl status --app $app_name
    
    echo "\n\033[0;32mYou can open your application with the following command:\033[0m"
    echo "flyctl open --app $app_name"
fi

echo "\033[0;32m\n===== Deployment process completed! =====\033[0m"
echo "Your application should now be running on Fly.io"
echo "For more information, visit: https://fly.io/docs/"