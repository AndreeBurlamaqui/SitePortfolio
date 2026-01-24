import { z, defineCollection } from 'astro:content';

// 1. Define the schema for "Games"
const gamesCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    genre: z.string(), // e.g., "RPG", "Action"
    cover: z.string(),
  }),
});

// 2. Define the schema for "UI Studies" (You can have different fields here!)
const uiCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    techStack: z.string(), // e.g., "Unity UI Toolkit", "ImGUI"
    videoUrl: z.string().optional(),
  }),
});

// 3. Export them to make them available
export const collections = {
  'released-games': gamesCollection,      // Looks in src/content/games
  'ui-studies': uiCollection,    // Looks in src/content/ui-studies
};