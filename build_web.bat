@echo off
SETLOCAL EnableDelayedExpansion

echo [1/4] Checking dependencies...
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: pnpm is not installed. Please install it first: https://pnpm.io/installation
    pause
    exit /b 1
)

echo [2/4] Installing dependencies...
call pnpm install

echo [3/4] Exporting web version...
call npx expo export --platform web

echo [4/4] Organizing output...
if not exist "builds" mkdir builds
if exist "dist" (
    echo Web version exported to 'dist' folder.
    echo Creating a zip archive in 'builds'...
    powershell Compress-Archive -Path dist\* -DestinationPath builds\web-version.zip -Force
)

echo.
echo ======================================================
echo Build Successful!
echo Your Web version is located in the 'dist' folder.
echo A backup archive is in 'builds\web-version.zip'.
echo ======================================================
echo To run it, you can use any static file server or upload to a host.
pause
