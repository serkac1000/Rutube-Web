// Preload script for Electron
window.addEventListener('DOMContentLoaded', () => {
  // You can expose APIs from here to the renderer process if needed
  console.log('Preload script loaded');
  
  // Inject a small script to indicate that we're running in Electron
  const electronRunningIndicator = document.createElement('script');
  electronRunningIndicator.textContent = `window.isElectron = true;`;
  document.head.appendChild(electronRunningIndicator);
});