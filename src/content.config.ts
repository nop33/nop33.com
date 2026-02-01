// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

// 2. Import loader(s)
import { glob } from 'astro/loaders'

// 3. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    github: z.string().optional(),
    live: z.string().optional(),
    download: z.string().optional(),
    featuredImage2: z.string().optional(),
    featuredImageWidth: z.number().optional(),
    links: z.array(z.object({ href: z.string(), label: z.string() })).default([]),
    keypoints: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    collaborators: z.array(z.string()).default([]),
  }),
})

// 4. Export a single `collections` object to register you collection(s)
export const collections = { projects }
