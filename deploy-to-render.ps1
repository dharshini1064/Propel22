# PowerShell script to prepare and deploy Propel22 to Render.com

Write-Host "\n===== Propel22 Render Deployment Helper =====\n" -ForegroundColor Cyan

Write-Host "This script will help you prepare your application for deployment to Render.com.\n" -ForegroundColor Yellow

# Check if render.yaml exists
if (-not (Test-Path "render.yaml")) {
    Write-Host "Error: render.yaml not found in the current directory." -ForegroundColor Red
    Write-Host "Please make sure you're running this script from the root of the Propel22 project." -ForegroundColor Red
    exit 1
}

# Check if git is installed
try {
    git --version | Out-Null
    $gitInstalled = $true
} catch {
    $gitInstalled = $false
}

if (-not $gitInstalled) {
    Write-Host "Git is not installed or not in your PATH. You'll need Git to deploy to Render." -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/downloads and try again." -ForegroundColor Red
    exit 1
}

# Check if the current directory is a git repository
if (-not (Test-Path ".git")) {
    Write-Host "The current directory is not a Git repository." -ForegroundColor Yellow
    
    $initRepo = Read-Host "Would you like to initialize a Git repository? (y/n)"
    if ($initRepo -eq "y") {
        git init
        Write-Host "Git repository initialized." -ForegroundColor Green
    } else {
        Write-Host "You'll need to push your code to a Git repository to deploy to Render." -ForegroundColor Yellow
    }
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "You have uncommitted changes in your repository:" -ForegroundColor Yellow
    git status
    
    $commitChanges = Read-Host "Would you like to commit these changes? (y/n)"
    if ($commitChanges -eq "y") {
        $commitMessage = Read-Host "Enter a commit message"
        git add .
        git commit -m $commitMessage
        Write-Host "Changes committed." -ForegroundColor Green
    }
}

# Check if the repository has a remote
$remotes = git remote
if (-not $remotes) {
    Write-Host "Your repository doesn't have a remote configured." -ForegroundColor Yellow
    Write-Host "You'll need to push your code to GitHub, GitLab, or Bitbucket to deploy to Render." -ForegroundColor Yellow
    
    Write-Host "\nPlease create a repository on GitHub, GitLab, or Bitbucket and then run:" -ForegroundColor Cyan
    Write-Host "git remote add origin YOUR_REPOSITORY_URL" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
}

# Verify environment variables
Write-Host "\n===== Environment Variables Check =====\n" -ForegroundColor Cyan

Write-Host "When deploying to Render, you'll need to set the following environment variables:" -ForegroundColor Yellow
Write-Host "- NODE_ENV: production" -ForegroundColor White
Write-Host "- JWT_SECRET: (a secure random string)" -ForegroundColor White
Write-Host "- PORT: 10000 (for the API service)" -ForegroundColor White
Write-Host "- DATABASE_URL: (will be automatically set when you create a PostgreSQL database in Render)" -ForegroundColor White
Write-Host "- REACT_APP_API_URL: (the URL of your API service, e.g., https://propel22-api.onrender.com)" -ForegroundColor White

# Free tier information
Write-Host "\n===== Render Free Tier Information =====\n" -ForegroundColor Cyan

Write-Host "Render offers a generous free tier for development and testing:" -ForegroundColor Yellow
Write-Host "- Static Sites: Always free with no time limitations" -ForegroundColor White
Write-Host "- Web Services: Free preview tier available" -ForegroundColor White
Write-Host "- PostgreSQL: Free instances available for 90 days" -ForegroundColor White
Write-Host "- Key-Value Stores: Free instances available" -ForegroundColor White

Write-Host "\nTo create free instances:" -ForegroundColor Yellow
Write-Host "1. When creating services, make sure to select the 'Free' instance type" -ForegroundColor White
Write-Host "2. For detailed instructions, see CREATE_FREE_RENDER_INSTANCE.md" -ForegroundColor White

# Provide deployment instructions
Write-Host "\n===== Deployment Instructions =====\n" -ForegroundColor Cyan

Write-Host "To deploy to Render:" -ForegroundColor Yellow
Write-Host "1. Create an account at https://render.com if you don't have one" -ForegroundColor White
Write-Host "2. Push your code to GitHub, GitLab, or Bitbucket" -ForegroundColor White
Write-Host "3. In the Render dashboard, click 'New' and select 'Blueprint'" -ForegroundColor White
Write-Host "4. Connect your repository" -ForegroundColor White
Write-Host "5. Render will automatically detect the render.yaml file and create the services" -ForegroundColor White
Write-Host "6. Click 'Apply' to start the deployment" -ForegroundColor White

Write-Host "\nAlternatively, you can manually create each service as described in RENDER_DEPLOYMENT.md" -ForegroundColor Yellow

Write-Host "\n===== Deployment Complete =====\n" -ForegroundColor Cyan
Write-Host "For more detailed instructions, please refer to RENDER_DEPLOYMENT.md" -ForegroundColor Green