import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translateText } from "./translation";
import { translateRequestSchema, translateResponseSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Helper to log requests
function logRequest(req: Request, message: string) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${message}`);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for translation
  app.post("/api/translate", async (req, res) => {
    logRequest(req, "Translation request received");
    console.log("Request body:", req.body);
    
    try {
      // Validate request
      const validatedRequest = translateRequestSchema.parse(req.body);
      logRequest(req, `Validated request: ${JSON.stringify(validatedRequest)}`);
      
      // Perform translation
      const translationResult = await translateText(validatedRequest);
      logRequest(req, `Translation completed: "${validatedRequest.text}" → "${translationResult.translatedText}"`);
      
      // Validate response for good measure
      const validatedResponse = translateResponseSchema.parse(translationResult);
      
      // Store translation in database if needed
      // This is optional and can be enabled based on requirements
      // await storage.saveTranslation({
      //   originalText: translationResult.originalText,
      //   translatedText: translationResult.translatedText,
      //   sourceLanguage: translationResult.sourceLanguage,
      //   targetLanguage: translationResult.targetLanguage,
      //   videoId: validatedRequest.videoId
      // });
      
      res.status(200).json(validatedResponse);
      logRequest(req, "Translation response sent successfully");
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        logRequest(req, `Validation error: ${validationError.message}`);
        res.status(400).json({ 
          message: validationError.message,
          success: false,
          error: "validation_error" 
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Translation error:", error);
        logRequest(req, `Error processing translation: ${errorMessage}`);
        
        // Send a more descriptive error to help debugging
        res.status(500).json({ 
          message: "Failed to translate text",
          details: errorMessage,
          success: false,
          error: "translation_error"
        });
      }
    }
  });

  // Test translation endpoint
  app.get("/api/translate/test", (_req, res) => {
    res.status(200).json({
      originalText: "Hello, world!",
      translatedText: "Привет, мир!",
      sourceLanguage: "en",
      targetLanguage: "ru",
      timestamp: new Date().toISOString(),
    });
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
