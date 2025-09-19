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
