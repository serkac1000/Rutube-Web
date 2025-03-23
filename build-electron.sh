#!/bin/bash
echo "Building Rutube Web Translator Desktop App..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    exit 1
fi

echo "Installing dependencies..."
npm install --save-dev electron electron-builder cross-env wait-on concurrently

echo "Building the application..."
# First build the Vite application
npm run build

echo "Which platform would you like to build for?"
echo "1) Windows (.exe)"
echo "2) macOS (.dmg)"
echo "3) Linux (.AppImage)"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Packaging for Windows..."
        npx electron-builder --win
        ;;
    2)
        echo "Packaging for macOS..."
        npx electron-builder --mac
        ;;
    3)
        echo "Packaging for Linux..."
        npx electron-builder --linux
        ;;
    *)
        echo "Invalid choice, building for current platform..."
        npx electron-builder
        ;;
esac

echo "Done! Check the dist-electron directory for the installer."