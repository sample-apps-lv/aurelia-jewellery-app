# Shopify Integration Strategy: Dynamic Homepage

This document outlines the strategy for transitioning the hardcoded sections in `src/routes/index.tsx` to dynamic content driven by the Shopify Storefront API.

## 1. Architectural Overview

The application will use the **Shopify Storefront API (GraphQL)** to fetch content. Data fetching will be handled via:
- **TanStack Start Loaders:** For SEO-critical content (Meta tags, Hero sections).
- **TanStack Query (Hooks):** For client-side interactions and product listing updates.

## 2. Section Mapping

| UI Section | Shopify Source | Implementation Detail |
| :--- | :--- | :--- |
| **Hero Video** | Page Metafields / Metaobjects | Store video URL, Heading, and CTA links in a "Home" Metaobject. |
| **Category Grid** | Collections | Fetch collections with a specific tag (e.g., `frontpage-category`) or a custom Menu. |
| **Bestsellers** | "Bestsellers" Collection | Query products from the collection with handle `bestsellers`. |
| **Promo Carousel** | Metaobjects | Create a `PromoBanner` Metaobject with fields: `image`, `link`, `title`. |
| **Shop by Price** | Search API / Filtered Collections | Dynamically link to catalog routes with price range parameters. |
| **Trust Bar/Promises** | Shop Metafields | Store "Policy" strings in Shopify Metafields for easy updates without redeployment. |

## 3. Technical Implementation

### GraphQL Client Setup
A lightweight fetch-based GraphQL client will be implemented in `src/lib/shopify.ts`.

```typescript
// Example Query for Hero Section
const HERO_QUERY = `
  query getHeroContent {
    metaobjects(type: "homepage_hero", first: 1) {
      nodes {
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image { url }
            }
            ... on Video {
              sources { url }
            }
          }
        }
      }
    }
  }
`;
```

### Data Fetching Flow
1. **Loader:** `src/routes/index.tsx` calls a `getHomePageData` function.
2. **Shopify API:** Responds with structured JSON.
3. **Component:** Maps Shopify JSON to existing UI components (`CategoryGrid`, `ProductCard`, etc.).

## 4. Metaobject Structure (Recommended)

To give non-technical users control over the homepage, define the following Metaobjects in Shopify:

### `Homepage Hero`
- `heading` (Single line text)
- `subheading` (Multi-line text)
- `video_background` (File/Video)
- `cta_label` (Single line text)
- `cta_link` (URL)

### `Promo Banner`
- `title` (Single line text)
- `image` (File/Image)
- `target_url` (URL)

## 5. Next Steps
1. Configure `.env` with `SHOPIFY_STOREFRONT_ACCESS_TOKEN` and `SHOPIFY_SHOP_DOMAIN`.
2. Implement `src/lib/shopify.ts` utility.
3. Refactor `useProducts` hook to fetch from Shopify instead of mock data.
4. Update `src/routes/index.tsx` to use fetched data.
