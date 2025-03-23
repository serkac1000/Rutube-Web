@echo off
setlocal enabledelayedexpansion

echo Rutube Web Translator - Desktop Build Script for Windows
echo ======================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

:: Check if client/dist exists
if not exist "client\dist" (
    echo Building client...
    call npm run build
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to build client.
        exit /b 1
    )
) else (
    echo Client build found.
)

:: Run the preparation script
echo Preparing Electron package...
node prepare-electron-package.js
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to prepare Electron package.
    exit /b 1
)

:: Copy the client build to the staging directory
echo Copying client build to staging directory...
if not exist "electron-staging\dist" mkdir "electron-staging\dist"
xcopy /E /I /Y "client\dist\*" "electron-staging\dist\"
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to copy client build.
    exit /b 1
)

:: Navigate to the staging directory and install dependencies
echo Installing dependencies in staging directory...
cd electron-staging
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install dependencies.
    cd ..
    exit /b 1
)

:: Build the Electron app
echo Building Electron app for Windows...
call npm run build:win
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to build Electron app.
    cd ..
    exit /b 1
)

cd ..
echo.
echo Build completed successfully!
echo Check the electron-staging\dist-electron directory for the installer.
echo.

endlocal