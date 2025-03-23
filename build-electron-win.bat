@echo off
echo Building Rutube Web Translator Desktop App for Windows...

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    exit /b 1
)

echo Installing dependencies...
call npm install --save-dev electron electron-builder cross-env wait-on concurrently

echo Building the application...
REM First build the Vite application
call npm run build

echo Packaging with Electron...
REM Run electron-builder for Windows
call npx electron-builder --win

echo Done! Check the dist-electron directory for the installer.
pause