import { z, defineCollection } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  engine: z.string(),
  language: z.string(),

  cover: z.string().optional(),
  trailer: z.string().optional(),
});

const gameSchema = baseSchema.extend({
  role: z.string().optional(),
  studio: z.string().optional(),

  // Where to play links
  itchUrl: z.string().url().optional(),
  googlePlayUrl: z.string().url().optional(),
  applePlayUrl: z.string().url().optional(),
  steamUrl: z.string().url().optional(),
});

const uiSchema = baseSchema.extend({
  techStack: z.string().optional(), // ImGUI, UITK, UMG, etc.
});

export const collections = {
  'released-games': defineCollection({ 
    type: 'content', 
    schema: gameSchema 
  }),
  
  'ui-studies': defineCollection({ 
    type: 'content', 
    schema: uiSchema 
  }),
};