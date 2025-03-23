// Preload script for Electron
const { contextBridge, ipcRenderer } = require('electron');

// Define the API exposed to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // App version information
  appInfo: {
    version: '1.0.0',
    isElectron: true
  },
  
  // File system operations
  fs: {
    // Add file system operations if needed
  },
  
  // System operations
  system: {
    // Add system operations if needed
  }
});

// Apply custom styles for Electron environment
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron preload script loaded');
  
  // Apply custom styles for the Electron environment
  const style = document.createElement('style');
  style.textContent = `
    /* Add any Electron-specific CSS here */
    .electron-only {
      display: block !important;
    }
    
    .web-only {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
  
  // Add a class to the body to indicate Electron environment
  document.body.classList.add('electron-environment');
  
  // Override the YouTube API to ensure it works in Electron
  const ytApiOverride = document.createElement('script');
  ytApiOverride.textContent = `
    // Fix YouTube iframe API for Electron
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = function() {
        console.log('YouTube iframe API ready (Electron)');
        if (window._onYTAPIReady) {
          window._onYTAPIReady();
        }
      };
    }
  `;
  document.head.appendChild(ytApiOverride);
});