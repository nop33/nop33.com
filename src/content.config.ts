// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

// 2. Import loader(s)
import { glob } from 'astro/loaders'

// Strips '/index' from directory-based entry IDs so that
// `shrinking-alephium-web3-sdk/index.mdx` → `shrinking-alephium-web3-sdk`
const stripIndex = ({ entry }: { entry: string }) => entry.replace(/\/index\.mdx$/, '').replace(/\.mdx$/, '')

// 3. Define your collection(s)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog', generateId: stripIndex }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      featuredImage: image().optional(),
      author: z.string().default('Ilias Trichopoulos'),
      tags: z.array(z.string()).default([]),
    }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects', generateId: stripIndex }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      description: z.string(),
      github: z.string().optional(),
      live: z.string().optional(),
      download: z.string().optional(),
      featuredImage2: image().optional(),
      featuredImageWidth: z.number().optional(),
      links: z.array(z.object({ href: z.string(), label: z.string() })).default([]),
      keypoints: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      collaborators: z.array(z.string()).default([]),
    }),
})

// 4. Export a single `collections` object to register you collection(s)
export const collections = { blog, projects }
