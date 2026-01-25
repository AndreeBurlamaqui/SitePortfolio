import { z, defineCollection } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  cover: z.string().optional(),

  importantTechStack: z.array(z.string()), // Language, Engine, UI Specifics (ImGUI, UITK, UMG), etc.
  extraTechStack: z.array(z.string()), // Studio, Specific Tools (Blender, Figma, PlayFab, etc.), etc.

//   backgroundClip: z.string().optional(), TODO: Make a background keep running behind title
});

const gameSchema = baseSchema.extend({
  role: z.string().optional(),
  studio: z.string().optional(),
  trailerId: z.string().optional(), // Must always be /embed/

  // Where to play links
  itchUrl: z.string().url().optional(),
  googlePlayUrl: z.string().url().optional(),
  applePlayUrl: z.string().url().optional(),
  steamUrl: z.string().url().optional(),
});

const uiSchema = baseSchema.extend({
  
    
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