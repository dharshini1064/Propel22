# Propel22 Fly.io Deployment Script for Windows
Write-Host "===== Propel22 Fly.io Deployment Script =====" -ForegroundColor Green

# Check if flyctl is installed
$flyctlExists = Get-Command flyctl -ErrorAction SilentlyContinue
if (-not $flyctlExists) {
    Write-Host "Error: flyctl is not installed." -ForegroundColor Red
    Write-Host "Please install the Fly CLI first by running this command in PowerShell:"
    Write-Host "  iwr https://fly.io/install.ps1 -useb | iex"
    exit 1
}

# Check if user is logged in
try {
    $whoami = flyctl auth whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "You need to log in to Fly.io first." -ForegroundColor Yellow
        flyctl auth login
    }
} catch {
    Write-Host "You need to log in to Fly.io first." -ForegroundColor Yellow
    flyctl auth login
}

Write-Host "`nStep 1: Launching the application on Fly.io" -ForegroundColor Green
Write-Host "This will create a new app on Fly.io using the configuration in fly.toml"
Write-Host "Note: If you've already created the app, you can skip this step." -ForegroundColor Yellow

$createApp = Read-Host "Do you want to create a new app on Fly.io? (y/n)"
if ($createApp -eq "y") {
    flyctl launch --no-deploy
    Write-Host "App created successfully!" -ForegroundColor Green
}

Write-Host "`nStep 2: Creating a PostgreSQL database" -ForegroundColor Green
Write-Host "This will create a free PostgreSQL database for your application"
Write-Host "Note: If you've already created a database, you can skip this step." -ForegroundColor Yellow

$createDb = Read-Host "Do you want to create a new PostgreSQL database? (y/n)"
if ($createDb -eq "y") {
    $dbName = Read-Host "Enter a name for your database (e.g., propel22-db)"
    flyctl postgres create --name $dbName --region dfw
    
    Write-Host "Database created successfully!" -ForegroundColor Green
    Write-Host "Now you need to attach the database to your app." -ForegroundColor Yellow
    
    $appName = Read-Host "Enter your app name (from fly.toml)"
    flyctl postgres attach --app $appName $dbName
    
    Write-Host "Database attached successfully!" -ForegroundColor Green
}

Write-Host "`nStep 3: Setting environment variables" -ForegroundColor Green
Write-Host "Setting up required environment variables for your application"

$setEnv = Read-Host "Do you want to set environment variables now? (y/n)"
if ($setEnv -eq "y") {
    $jwtSecret = Read-Host "Enter your JWT_SECRET (or press Enter to generate one)"
    
    if ([string]::IsNullOrEmpty($jwtSecret)) {
        $randomBytes = New-Object byte[] 32
        [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($randomBytes)
        $jwtSecret = [Convert]::ToBase64String($randomBytes)
        Write-Host "Generated JWT_SECRET: $jwtSecret"
    }
    
    $appName = Read-Host "Enter your app name (from fly.toml)"
    
    # Set environment variables
    flyctl secrets set JWT_SECRET="$jwtSecret" --app $appName
    flyctl secrets set JWT_EXPIRES_IN="7d" --app $appName
    
    Write-Host "Environment variables set successfully!" -ForegroundColor Green
}

Write-Host "`nStep 4: Deploying your application" -ForegroundColor Green
Write-Host "This will deploy your application to Fly.io"

$deployApp = Read-Host "Do you want to deploy your application now? (y/n)"
if ($deployApp -eq "y") {
    flyctl deploy
    
    Write-Host "Deployment initiated!" -ForegroundColor Green
}

Write-Host "`nStep 5: Checking deployment status" -ForegroundColor Green
$checkStatus = Read-Host "Do you want to check the status of your deployment? (y/n)"
if ($checkStatus -eq "y") {
    $appName = Read-Host "Enter your app name (from fly.toml)"
    flyctl status --app $appName
    
    Write-Host "`nYou can open your application with the following command:" -ForegroundColor Green
    Write-Host "flyctl open --app $appName"
}

Write-Host "`n===== Deployment process completed! =====" -ForegroundColor Green
Write-Host "Your application should now be running on Fly.io"
Write-Host "For more information, visit: https://fly.io/docs/"