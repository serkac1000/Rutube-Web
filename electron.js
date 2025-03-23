const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
const express = require('express');
const serverApp = require('./server');

let mainWindow;
let server;

// Set environment variable to indicate we're running in Electron
process.env.ELECTRON_RUN = 'true';

function createWindow() {
  // Start Express server
  const expressApp = express();
  
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
      role: 'help',
      submenu: [
        {
          label: 'About',
          click: async () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              title: 'About Rutube Web Translator',
              message: 'Rutube Web Translator',
              detail: 'Version 1.0.0\nA web application that provides real-time Russian translation of English speech in YouTube videos.'
            });
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  
  serverApp(expressApp).then(serverInstance => {
    server = serverInstance;
    
    // We need a local HTTP server to host our application
    // Let's use port 5000 by default
    const port = 5000;
    server.listen(port, 'localhost', () => {
      console.log(`Express server started on http://localhost:${port}`);
      
      // Create the browser window after the server is ready
      mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, 'preload.js')
        },
        title: 'Rutube Web Translator',
        icon: path.join(__dirname, 'resources', 'icon.png')
      });

      // Load the app
      mainWindow.loadURL(`http://localhost:${port}`);

      // Open DevTools in development
      // Uncomment the following line during development
      // mainWindow.webContents.openDevTools();

      mainWindow.on('closed', function () {
        mainWindow = null;
      });
    });
  });
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