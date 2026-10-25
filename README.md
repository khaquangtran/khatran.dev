# Kha Engineering Notes

A personal engineering journal built with React, React Router, and Vite.

## Getting started

```sh
pnpm install
pnpm dev
```

## Commands

```sh
pnpm build
pnpm format
pnpm format:check
```

## Project layout

- `src/app/` — application shell, theme state, and routes
- `src/components/` — reusable navigation, cards, illustrations, and UI
- `src/data/` — article metadata, Markdown loading, and cheatsheet content
- `src/content/articles/` — long-form article bodies in Markdown
- `src/pages/` — route-level pages; all essays share one article renderer
- `src/styles/global.css` — global styles, tokens, and responsive layouts
- `public/` — static assets copied into the production build

Each Markdown article in `src/content/articles/` starts with frontmatter for its title, description, publication date, category, reading time, author, and keywords. The shared article page uses that metadata for its heading and search metadata. Shared renderers in `src/components/ArticleMarkdown.jsx` and `src/components/ArticleBlocks.jsx` handle headings, prose, code, images, callouts, and reusable diagrams. Add article visuals with a Markdown image (`![alt text](/images/example.png "Caption")`) or a registered component directive such as `:::SkipLockedDiagram`. Page titles, descriptions, canonical URLs, social previews, and structured data are managed in `src/components/Seo.jsx`.
