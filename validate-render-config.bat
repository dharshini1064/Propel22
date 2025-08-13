@echo off
echo ===== Propel22 Render Configuration Validator =====
echo This script will validate your Render configuration files.
echo.

set errors=0
set warnings=0

REM Check if render.yaml exists
if exist render.yaml (
    echo [32m✓ render.yaml found[0m
) else (
    echo [31m✗ render.yaml not found[0m
    set /a errors+=1
)

REM Check if package.json exists
if exist package.json (
    echo [32m✓ package.json found[0m
) else (
    echo [31m✗ package.json not found[0m
    set /a errors+=1
)

REM Check if client config.js exists
if exist client\src\config.js (
    echo [32m✓ Client config.js found[0m
) else (
    echo [31m✗ Client config.js not found[0m
    set /a errors+=1
)

REM Check if server models/index.js exists
if exist server\models\index.js (
    echo [32m✓ Server models/index.js found[0m
) else (
    echo [31m✗ Server models/index.js not found[0m
    set /a errors+=1
)

echo.
echo ===== Validation Summary =====
if %errors% EQU 0 (
    echo [32mAll checks passed! Your configuration is ready for Render deployment.[0m
) else (
    echo [31mConfiguration has %errors% error(s). Please fix the errors before deploying.[0m
)

echo.
echo For deployment instructions, refer to RENDER_DEPLOYMENT_GUIDE.md