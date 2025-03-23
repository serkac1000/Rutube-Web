const express = require('express');
const http = require('http');
const path = require('path');

function log(message, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

/**
 * Initialize the server and return the HTTP server instance
 * @param {express.Express} app - Express app instance
 * @returns {Promise<http.Server>} HTTP server instance
 */
async function initializeServer(app = express()) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Middleware to log API requests
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  // API routes
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLanguage = 'ru' } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }
      
      // Simple translation service using hardcoded translations for common phrases
      // In a real app, this would call a translation API
      const translations = {
        'hello': 'привет',
        'world': 'мир',
        'welcome': 'добро пожаловать',
        'thank you': 'спасибо',
        'yes': 'да',
        'no': 'нет',
        'goodbye': 'до свидания'
      };
      
      const lowerText = text.toLowerCase();
      let translatedText = '';
      
      if (translations[lowerText]) {
        translatedText = translations[lowerText];
      } else {
        // Mock translation - just reverse the text for demo purposes
        translatedText = `[${targetLanguage}] ${text}`;
      }
      
      return res.json({ 
        originalText: text,
        translatedText,
        targetLanguage
      });
    } catch (error) {
      console.error('Translation error:', error);
      return res.status(500).json({ error: 'Translation failed' });
    }
  });

  // Serve static files from the client/dist directory
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  
  // For any other request, send the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });

  // Error handling middleware
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  // Create HTTP server
  const server = http.createServer(app);
  
  return server;
}

/**
 * Initialize and start the server
 * @param {express.Express} app - Express app instance
 * @returns {Promise<http.Server>} HTTP server instance
 */
module.exports = async function startServer(app = express()) {
  const server = await initializeServer(app);
  
  // ALWAYS serve the app on port 5000
  if (!process.env.ELECTRON_RUN) {
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      log(`serving on port ${port}`);
    });
  }
  
  return server;
};

// If this file is run directly, start the server
if (require.main === module) {
  startServer();
}