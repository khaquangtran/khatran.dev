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
- `src/data/` — article metadata and cheatsheet content
- `src/pages/` — route-level pages and the long-form Shopify article
- `src/styles/global.css` — global styles, tokens, and responsive layouts
- `public/` — static assets copied into the production build

Article metadata lives in `src/data/articles.js`. The Shopify walkthrough and its illustrative diagrams live in `src/pages/ShopifyArticle.jsx`.
