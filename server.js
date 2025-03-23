const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");

/**
 * Log message with source
 * @param {string} message - Message to log
 * @param {string} source - Source of the log message
 */
function log(message, source = "express") {
  console.log(`[${source}] ${message}`);
}

/**
 * Initialize the server and return the HTTP server instance
 * @param {express.Express} app - Express app instance
 * @returns {Promise<http.Server>} HTTP server instance
 */
async function initializeServer(app = express()) {
  // Set up basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Set correct MIME types for Electron
  app.use((req, res, next) => {
    if (req.url.endsWith(".js")) {
      res.setHeader("Content-Type", "text/javascript");
    } else if (req.url.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    } else if (req.url.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html");
    }
    next();
  });

  // Handle errors
  app.use((err, req, res, next) => {
    log(`Error: ${err.message}`, "error");
    res.status(500).json({ error: "Internal Server Error" });
  });

  // For desktop app, serve static files from the dist directory
  if (process.env.ELECTRON_RUN === "true") {
    const distPath = path.join(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      log(`Serving static files from: ${distPath}`);
      app.use(express.static(distPath));
      
      // Always serve index.html for any non-recognized paths (SPA)
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    } else {
      log(`Warning: ${distPath} does not exist`, "error");
    }
  }

  // Create HTTP server
  const server = http.createServer(app);
  return server;
}

/**
 * Initialize and start the server
 * @param {express.Express} app - Express app instance
 * @returns {Promise<http.Server>} HTTP server instance
 */
async function startServer(app = express()) {
  try {
    const server = await initializeServer(app);
    return server;
  } catch (error) {
    log(`Failed to start server: ${error.message}`, "error");
    throw error;
  }
}

module.exports = startServer;