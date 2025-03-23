import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Translations schema
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  originalText: text("original_text").notNull(),
  translatedText: text("translated_text").notNull(),
  sourceLanguage: text("source_language").notNull().default("en"),
  targetLanguage: text("target_language").notNull().default("ru"),
  videoId: text("video_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTranslationSchema = createInsertSchema(translations).pick({
  originalText: true,
  translatedText: true,
  sourceLanguage: true,
  targetLanguage: true,
  videoId: true,
});

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

// Translation request/response types
export const translateRequestSchema = z.object({
  text: z.string(),
  sourceLanguage: z.string().default("en"),
  targetLanguage: z.string().default("ru"),
  videoId: z.string().optional(),
});

export type TranslateRequest = z.infer<typeof translateRequestSchema>;

export const translateResponseSchema = z.object({
  originalText: z.string(),
  translatedText: z.string(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  timestamp: z.string().optional(),
});

export type TranslateResponse = z.infer<typeof translateResponseSchema>;
