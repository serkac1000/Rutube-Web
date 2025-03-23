# Building the Rutube Web Translator Desktop Application

This guide explains how to build the desktop application version of Rutube Web Translator using Electron and electron-builder.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/serkac1000/Rutube-Web.git
   cd Rutube-Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Building the Web Application

Before packaging the desktop application, you need to build the web application:

1. Build the client:
   ```bash
   npm run build
   ```

   This command builds the React application and generates static files in the `client/dist` directory.

## Packaging the Desktop Application

### Automated Setup

We've provided a script that automates most of the packaging setup process:

1. Run the preparation script:
   ```bash
   node prepare-electron-package.js
   ```

2. Navigate to the staging directory:
   ```bash
   cd electron-staging
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy the built web application:
   ```bash
   cp -r ../client/dist .
   ```

### Building for Windows

#### Using Windows

If you're on a Windows machine, you can use the provided batch file:

```bash
build-electron-win.bat
```

Or run the following commands manually:

```bash
cd electron-staging
npm run build:win
```

This will generate installer files in the `dist-electron` directory.

#### Using macOS/Linux to build for Windows

Cross-platform building requires Wine and additional setup. It's recommended to build on the target platform when possible.

### Building for macOS

**Note**: Building for macOS is only supported on macOS systems due to code signing requirements.

```bash
cd electron-staging
npm run build:mac
```

Or use the shell script:

```bash
./build-electron.sh mac
```

### Building for Linux

```bash
cd electron-staging
npm run build:linux
```

Or use the shell script:

```bash
./build-electron.sh linux
```

## Build Outputs

After a successful build, you'll find the packaged applications in the `electron-staging/dist-electron` directory:

- Windows: `.exe` installer and/or portable `.exe`
- macOS: `.dmg` disk image
- Linux: `.AppImage`, `.deb`, and/or `.rpm` packages

## Customizing the Build

### Application Icons

To customize the application icon:

1. Replace the icon files in the `resources` directory:
   - `icon.png` - Main application icon (at least 512x512px)
   - `icon.ico` - Windows icon
   - `icon.icns` - macOS icon

### Build Configuration

The build configuration is in `electron-builder.yml`. You can modify this file to change:

- Application metadata
- Build targets
- Package formats
- Installer options

## Troubleshooting

### Windows Build Issues

- **Error with code signing**: If you encounter code signing errors, you can disable code signing by modifying the `electron-builder.yml` file.

### macOS Build Issues

- **Code signing errors**: macOS builds require proper code signing. If you don't have an Apple Developer account, you can build unsigned applications for personal use.

### Linux Build Issues

- **Missing dependencies**: Some Linux distributions may require additional dependencies. Consult the electron-builder documentation for your specific distribution.

## Advanced Configuration

### Custom Installation Directories

Modify the `electron-builder.yml` file to change installation directories and other installer options.

### Auto-Updates

The current configuration doesn't include auto-updates. To add auto-update functionality:

1. Set up a server to host updates
2. Configure `electron-builder.yml` with `publish` options
3. Implement update checking logic in the main process

See the [electron-builder documentation](https://www.electron.build/auto-update) for more details.

## Distribution

After building the application:

1. Test the installer and application thoroughly
2. Upload the builds to your preferred distribution channel (website, GitHub releases, etc.)
3. Update the download links in documentation

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [Code Signing Guide](https://www.electron.build/code-signing)

---

For more information or to report issues, please visit the [GitHub repository](https://github.com/serkac1000/Rutube-Web).