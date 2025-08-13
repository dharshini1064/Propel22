# Propel22 Setup Script for Windows

Write-Host "Setting up Propel22 - Automated Joint Business Planning & Bookkeeping Platform" -ForegroundColor Green

# Create .env file from example if it doesn't exist
if (-not (Test-Path -Path ".env")) {
    Write-Host "Creating .env file from example..." -ForegroundColor Yellow
    Copy-Item -Path ".env.example" -Destination ".env"
    Write-Host "Created .env file. Please update it with your configuration." -ForegroundColor Green
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm run install-all

# Check if PostgreSQL is installed
$pgCheck = Get-Command psql -ErrorAction SilentlyContinue
if ($pgCheck) {
    Write-Host "PostgreSQL is installed. Would you like to initialize the database? (y/n)" -ForegroundColor Yellow
    $initDb = Read-Host
    if ($initDb -eq "y") {
        Write-Host "Initializing database..." -ForegroundColor Yellow
        psql -U postgres -f database/init.sql
    }
} else {
    Write-Host "PostgreSQL is not installed or not in PATH. Please install PostgreSQL and run the database initialization script manually." -ForegroundColor Red
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "To start the development server, run: npm run dev" -ForegroundColor Cyan
Write-Host "To deploy with Docker, run: docker-compose up -d" -ForegroundColor Cyan