const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const url = require('url');
const express = require('express');
const serverApp = require('./server');
const fs = require('fs');

let mainWindow;
let server;
let serverPort = 5000; // Default port
let isAppQuitting = false;
let serverStartRetries = 0;
const MAX_SERVER_START_RETRIES = 5;

// Set environment variable to indicate we're running in Electron
process.env.ELECTRON_RUN = 'true';

// Create application log directory
const appDataPath = app.getPath('userData');
const logPath = path.join(appDataPath, 'logs');
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath, { recursive: true });
}

// Setup logging
const logFile = path.join(logPath, `rutube-${new Date().toISOString().replace(/:/g, '-')}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Redirect console output to log file
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
console.log = function() {
  const args = Array.from(arguments);
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [INFO] ${args.join(' ')}`;
  logStream.write(logMessage + '\n');
  originalConsoleLog.apply(console, arguments);
};
console.error = function() {
  const args = Array.from(arguments);
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [ERROR] ${args.join(' ')}`;
  logStream.write(logMessage + '\n');
  originalConsoleError.apply(console, arguments);
};

function createWindow() {
  console.log('Starting Rutube Web Translator...');
  
  // Setup menu
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: async () => {
            dialog.showMessageBox(mainWindow, {
              title: 'About Rutube Web Translator',
              message: 'Rutube Web Translator',
              detail: 'Version 1.0.0\nA web application that provides real-time Russian translation of English speech in YouTube videos.',
              buttons: ['OK', 'View Logs'],
              defaultId: 0,
              cancelId: 0
            }).then(result => {
              if (result.response === 1) {
                shell.openPath(logPath);
              }
            });
          }
        },
        {
          label: 'View Logs',
          click: async () => {
            shell.openPath(logPath);
          }
        },
        { type: 'separator' },
        {
          label: 'GitHub Repository',
          click: async () => {
            await shell.openExternal('https://github.com/serkac1000/Rutube-Web');
          }
        }
      ]
    }
  ];
  
  if (process.platform === 'darwin') {
    // macOS specific menu items
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  
  // Start Express server
  startServer();
}

function startServer() {
  try {
    console.log(`Starting Express server (attempt ${serverStartRetries + 1})...`);
    const expressApp = express();
    
    serverApp(expressApp).then(serverInstance => {
      server = serverInstance;
      
      // Try to find an available port, starting with the default
      tryListenOnPort(serverPort);
    }).catch(err => {
      console.error('Failed to initialize server:', err);
      handleServerStartFailure();
    });
  } catch (err) {
    console.error('Error starting server:', err);
    handleServerStartFailure();
  }
}

function tryListenOnPort(port) {
  server.listen(port, 'localhost')
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying port ${port + 1}...`);
        serverPort = port + 1;
        tryListenOnPort(serverPort);
      } else {
        console.error('Error starting server:', err);
        handleServerStartFailure();
      }
    })
    .on('listening', () => {
      console.log(`Express server started on http://localhost:${serverPort}`);
      createMainWindow();
    });
}

function createMainWindow() {
  // Create the browser window after the server is ready
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Rutube Web Translator',
    icon: path.join(__dirname, 'resources', 'icon.png'),
    show: false // Don't show until ready-to-show
  });

  // Show loading screen
  mainWindow.loadFile(path.join(__dirname, 'resources', 'loading.html')).catch(() => {
    // If loading screen fails, just load the app directly
    loadMainApplication();
  });

  // Wait a moment and then load the real app
  setTimeout(loadMainApplication, 1500);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function loadMainApplication() {
  if (!mainWindow) return;
  
  const loadingUrl = `http://localhost:${serverPort}`;
  console.log(`Loading application from: ${loadingUrl}`);
  
  mainWindow.loadURL(loadingUrl).catch(err => {
    console.error('Failed to load application:', err);
    
    if (!isAppQuitting) {
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: 'Application Error',
        message: 'Failed to load the application',
        detail: `Error: ${err.message}\n\nThe server might not be running correctly. Please restart the application.`,
        buttons: ['OK']
      });
    }
  });
}

function handleServerStartFailure() {
  serverStartRetries++;
  
  if (serverStartRetries < MAX_SERVER_START_RETRIES) {
    console.log(`Retrying server start in 1 second... (Attempt ${serverStartRetries + 1} of ${MAX_SERVER_START_RETRIES})`);
    setTimeout(startServer, 1000);
  } else {
    console.error('Failed to start server after multiple attempts');
    
    dialog.showErrorBox(
      'Server Error',
      'Failed to start the application server after multiple attempts. Please check if port 5000-5010 is available and try again.'
    );
    
    app.quit();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // Close the server when all windows are closed
  if (server) {
    server.close(() => {
      console.log('Express server closed');
    });
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});