import { z } from 'zod';

export const CreateWorkspace = z.object({
  title: z.string().min(1)
});

export const CreateResource = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  notes: z.string().optional(),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  data: z.any().optional()
});

export const CreateAnnotation = z.object({
  body: z.string().min(1),
  highlights: z.any().optional()
});

export const CreateShare = z.object({
  expiresAt: z.string().datetime().optional()
});

export const UpdateProfile = z.object({
  displayName: z.string().min(1, "Display name is required").max(50, "Display name must be less than 50 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  preferences: z.object({
    theme: z.enum(["system", "light", "dark"]),
    language: z.string().default("en-IN"),
    emailNotifications: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
  }).optional(),
});
