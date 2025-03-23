# Electron Build Guide for Rutube Web Translator

This guide explains how to build the desktop version of the Rutube Web Translator application using Electron.

## Prerequisites

Make sure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)

## Setup

1. Install the necessary dependencies:
```bash
npm install --save-dev electron electron-builder cross-env wait-on concurrently
```

2. Add these scripts to your package.json:
```json
"scripts": {
  "electron": "cross-env NODE_ENV=development concurrently \"npm run dev\" \"wait-on http://localhost:5000 && electron .\"",
  "electron:build": "npm run build && electron-builder",
  "electron:build:win": "npm run build && electron-builder --win",
  "electron:build:mac": "npm run build && electron-builder --mac",
  "electron:build:linux": "npm run build && electron-builder --linux"
}
```

## File Structure

The following files are critical for the Electron build process:

1. `electron.js` - The main Electron process file
2. `preload.js` - Preload script for the Electron renderer process
3. `server.js` - Standalone Express server implementation
4. `electron-builder.yml` - Configuration for electron-builder
5. `resources/` - Directory containing application icons

## Building the Desktop Application

### For Windows (.exe):
```bash
npm run electron:build:win
```

### For macOS (.dmg):
```bash
npm run electron:build:mac
```

### For Linux (.AppImage):
```bash
npm run electron:build:linux
```

The built packages will be available in the `dist-electron` directory.

## Running in Development Mode

To test the Electron application in development mode:
```bash
npm run electron
```

This will start both the Express server and the Electron application.

## Important Notes

- The application uses port 5000 by default. Ensure this port is available for the server to run.
- The `type: "module"` in package.json might need to be temporarily changed to `type: "commonjs"` during the build process since Electron uses CommonJS modules.
- You may need to update the webPreferences in electron.js based on your security requirements.

## Troubleshooting

- If you encounter errors during the build process, check the console output for specific error messages.
- Ensure that all the necessary files are included in the `files` section of electron-builder.yml.
- Make sure the resources directory contains the correct icons for each platform you're targeting.