import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translateText } from "./translation";
import { translateRequestSchema, translateResponseSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for translation
  app.post("/api/translate", async (req, res) => {
    try {
      // Validate request
      const validatedRequest = translateRequestSchema.parse(req.body);
      
      // Perform translation
      const translationResult = await translateText(validatedRequest);
      
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
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Translation error:", error);
        res.status(500).json({ message: "Failed to translate text" });
      }
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
