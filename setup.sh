#!/bin/bash

# Propel22 Setup Script for Unix-based systems

echo "\033[0;32mSetting up Propel22 - Automated Joint Business Planning & Bookkeeping Platform\033[0m"

# Create .env file from example if it doesn't exist
if [ ! -f ".env" ]; then
    echo "\033[0;33mCreating .env file from example...\033[0m"
    cp .env.example .env
    echo "\033[0;32mCreated .env file. Please update it with your configuration.\033[0m"
fi

# Install dependencies
echo "\033[0;33mInstalling dependencies...\033[0m"
npm run install-all

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "\033[0;33mPostgreSQL is installed. Would you like to initialize the database? (y/n)\033[0m"
    read initDb
    if [ "$initDb" = "y" ]; then
        echo "\033[0;33mInitializing database...\033[0m"
        psql -U postgres -f database/init.sql
    fi
else
    echo "\033[0;31mPostgreSQL is not installed. Please install PostgreSQL and run the database initialization script manually.\033[0m"
fi

echo "\033[0;32mSetup complete!\033[0m"
echo "\033[0;36mTo start the development server, run: npm run dev\033[0m"
echo "\033[0;36mTo deploy with Docker, run: docker-compose up -d\033[0m"

# Make the script executable
chmod +x setup.sh