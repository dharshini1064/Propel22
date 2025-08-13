# PowerShell script to validate Render configuration

Write-Host "===== Propel22 Render Configuration Validator =====" -ForegroundColor Cyan
Write-Host "This script will validate your Render configuration files." -ForegroundColor Yellow
Write-Host ""

$errors = 0
$warnings = 0

# Check if render.yaml exists
if (Test-Path -Path "render.yaml") {
    Write-Host "✓ render.yaml found" -ForegroundColor Green
    
    # Read render.yaml content
    $renderYaml = Get-Content -Path "render.yaml" -Raw
    
    # Check for required services
    if ($renderYaml -match "propel22-api") {
        Write-Host "  ✓ API service configuration found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ API service configuration missing" -ForegroundColor Red
        $errors++
    }
    
    if ($renderYaml -match "propel22-client") {
        Write-Host "  ✓ Client service configuration found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Client service configuration missing" -ForegroundColor Red
        $errors++
    }
    
    if ($renderYaml -match "propel22-db") {
        Write-Host "  ✓ Database configuration found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Database configuration missing" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "✗ render.yaml not found" -ForegroundColor Red
    $errors++
}

# Check if package.json has render scripts
if (Test-Path -Path "package.json") {
    Write-Host "✓ package.json found" -ForegroundColor Green
    
    # Read package.json content
    try {
        $packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
        
        if ($packageJson.scripts.PSObject.Properties.Name -contains "render-build") {
            Write-Host "  ✓ render-build script found" -ForegroundColor Green
        } else {
            Write-Host "  ! render-build script missing (recommended)" -ForegroundColor Yellow
            $warnings++
        }
    } catch {
        Write-Host "  ✗ Error parsing package.json" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "✗ package.json not found" -ForegroundColor Red
    $errors++
}

# Check if client config.js exists
$clientConfigPath = "client/src/config.js"
if (Test-Path -Path $clientConfigPath) {
    Write-Host "✓ Client config.js found" -ForegroundColor Green
} else {
    Write-Host "✗ Client config.js not found" -ForegroundColor Red
    $errors++
}

# Check if server models/index.js exists
$serverModelsPath = "server/models/index.js"
if (Test-Path -Path $serverModelsPath) {
    Write-Host "✓ Server models/index.js found" -ForegroundColor Green
} else {
    Write-Host "✗ Server models/index.js not found" -ForegroundColor Red
    $errors++
}

# Summary
Write-Host ""
Write-Host "===== Validation Summary =====" -ForegroundColor Cyan
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "All checks passed! Your configuration is ready for Render deployment." -ForegroundColor Green
} elseif ($errors -eq 0) {
    Write-Host "Configuration is valid but has $warnings warning(s). You can deploy, but consider addressing the warnings." -ForegroundColor Yellow
} else {
    Write-Host "Configuration has $errors error(s) and $warnings warning(s). Please fix the errors before deploying." -ForegroundColor Red
}

Write-Host ""
Write-Host "For deployment instructions, refer to RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan