# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog site (nop33.com) built on the Accessible Astro Starter theme. Static site (SSG) using Astro 5, Tailwind CSS 4, TypeScript (strict), and SCSS. Accessibility is a core requirement — WCAG 2.2 AA compliance throughout.

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build
npx prettier --write .   # Format code
npx eslint .             # Lint (includes strict a11y rules via jsx-a11y)
```

Node version: v20.5.1 (see .nvmrc)

## Architecture

**Astro file-based routing** — pages in `src/pages/` map directly to routes. Dynamic routes use `[param].astro` and `[...param].astro` syntax.

**Content Collections** — projects live as MDX files in `src/content/projects/` with schema defined in `src/content.config.ts`. Query with `getCollection('projects')`. Blog posts are `.astro` files in `src/pages/blog/`.

**Layouts** — `DefaultLayout.astro` is the main wrapper (header/footer). `MarkdownLayout.astro` for MDX content.

**Components** — two sources:
- `accessible-astro-components` package: `Button`, `Link`, `Card`, `Modal`, `Accordion`, `DarkMode`, form components, etc.
- Custom components in `src/components/`: `Hero`, `PageHeader`, `CallToAction`, `FeaturedPosts`, `FeaturedProjects`, `Experience`, `Navigation`, `SiteMeta` (SEO), etc.

**Path aliases** (configured in astro.config.mjs and tsconfig.json):
- `@components`, `@layouts`, `@assets`, `@content`, `@pages`, `@public`
- `@post-images` → `./public/posts`, `@project-images` → `./public/projects`

## Styling

- **Tailwind CSS v4** with Vite plugin — global styles in `src/styles/tailwind.css`
- **SCSS** utilities in `src/assets/scss/` — custom properties, reset, typography
- **OKLCH** color system with automatic palette generation
- Use **logical properties** (e.g., `inline-start` not `left`)
- Atkinson Hyperlegible font for readability
- Component-scoped styles use `<style lang="scss" is:global>`

## Accessibility

- Semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.) — never use `<div>` for interactive elements
- All interactive elements must be keyboard accessible
- Never remove focus outlines without accessible alternatives
- Respect `prefers-reduced-motion` for all animations
- ARIA only when native HTML is insufficient
- Maintain proper heading hierarchy (h1-h6)
- ESLint jsx-a11y strict rules are enforced

## Code Style

- **Prettier**: 2-space indent, no semicolons, single quotes, 120 char width
- Plugins: `prettier-plugin-astro`, `prettier-plugin-tailwindcss`, `prettier-plugin-css-order`

## Commit Guidelines

Conventional commits: `type(scope): subject`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `a11y`

## Adding Content

**New project**: Create `.mdx` in `src/content/projects/`, add frontmatter per schema in `content.config.ts`, images in `public/projects/`.

**New blog post**: Create `.astro` in `src/pages/blog/`, images in `public/posts/`. Pagination handled by `[...page].astro`.
