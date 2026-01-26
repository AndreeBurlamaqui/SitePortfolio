import { z, defineCollection } from 'astro:content';

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  
  cover: z.string().optional(),
  
  // Date
  timeFrame: z.string(), // Year or Range
  sortDate: z.coerce.date(), // For sorting

  role: z.string(), // Solo or specific roles
  status: z.string(), // Released, In Development, Abandoned, etc.
  engine: z.string(), // Unity, Unreal, Godot, Custom, etc.
  language: z.string(), // C#, C++, GDScript, etc.
  studio: z.string().optional(), // Company or Team name

  importantTechStack: z.array(z.string()).optional(), // Shown on card, useful for UI (ImGUI, UITK, UMG)
  extraTechStack: z.array(z.string()).optional(), // Shown on page useful for tools (Blender, Figma, PlayFab, etc.)

//   backgroundClip: z.string().optional(), TODO: Make a background keep running behind title
});

const gameSchema = baseSchema.extend({
  trailerId: z.string().optional(), // Must always be /embed/

  // Where to play links
  itchUrl: z.string().url().optional(),
  googlePlayUrl: z.string().url().optional(),
  applePlayUrl: z.string().url().optional(),
  steamUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
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

  'prototypes': defineCollection({ 
    type: 'content', 
    schema: gameSchema 
  }),
};