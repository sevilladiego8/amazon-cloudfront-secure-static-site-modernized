<h1 align="center">
<br>
Simple Static Site
</h1>
<h2 align="center" >Vite + React + Typescript</h2>

# Simple Static Website

A minimal static site built with React 19, TypeScript, Vite, Tailwind CSS v4, and React Router v7. Deployed to [lab.diegosevilla.dev](https://lab.diegosevilla.dev) via Amazon CloudFront.

## Tech stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI |
| TypeScript | 6 | Type safety |
| Vite | 8 | Dev server & bundler |
| Tailwind CSS | 4 | Styling |
| React Router | 7 | Client-side routing |

## Project structure

```
src/
  App.tsx          # Route definitions
  Layout.tsx       # Shared nav shell + site-wide metadata
  pages/
    Home.tsx
    About.tsx
    Contact.tsx
    NotFound.tsx   # Catch-all, noindex
public/
  robots.txt
  sitemap.xml
  favicon.svg
```

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Serve the `dist/` build locally |
| `npm run lint` | Run ESLint |

## Adding a page

1. Create `src/pages/MyPage.tsx` with a `<title>` and `<meta name="description">` tag:

```tsx
export default function MyPage() {
  return (
    <>
      <title>{`My Page | CF Static Site`}</title>
      <meta name="description" content="..." />
      <section>...</section>
    </>
  )
}
```

2. Add a `<Route>` in [App.tsx](src/App.tsx) inside the `<Route element={<Layout />}>` block.

3. Add a `<NavLink>` in [Layout.tsx](src/Layout.tsx).

4. Add the URL to [public/sitemap.xml](public/sitemap.xml).

React 19 hoists `<title>` and `<meta>` tags to `<head>` automatically — no extra library needed.

## SEO notes

- Site-wide metadata (`author`, `robots`, `og:site_name`, `theme-color`) lives in `Layout.tsx`.
- Each page sets its own `title` and `description`.
- `NotFound.tsx` adds `<meta name="robots" content="noindex" />` to override the layout default.
- `public/robots.txt` and `public/sitemap.xml` are copied to the build root as-is by Vite.

## Deployment

Build output goes to `dist/`. The parent repo configures CloudFront + S3 to serve it. For SPA routing to work, the CloudFront distribution must redirect all 404s back to `/index.html`.
