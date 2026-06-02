import { createServerFn } from "@tanstack/react-start";

const domain = import.meta.env.VITE_SHOPIFY_SHOP_DOMAIN;
const adminAccessToken = import.meta.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN;

async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<{ data: T } | never> {
  if (!domain || !adminAccessToken) {
    throw new Error("Shopify domain or Admin access token is missing.");
  }

  const endpoint = `https://${domain}/admin/api/2024-01/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors) {
    console.error("Shopify Admin API Errors:", json.errors);
    throw new Error(json.errors[0].message || "Shopify Admin API error");
  }

  return json;
}

export const createProductFn = createServerFn({ method: "POST" })
  .inputValidator((data: { title: string; descriptionHtml?: string; vendor?: string; productType?: string; price: string }) => data)
  .handler(async ({ data }) => {
    const query = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title: data.title,
        descriptionHtml: data.descriptionHtml,
        vendor: data.vendor,
        productType: data.productType,
        variants: [
          {
            price: data.price,
          },
        ],
      },
    };

    const result = await shopifyAdminFetch<{ productCreate: any }>({ query, variables });
    return result.data.productCreate;
  });

export const createCollectionFn = createServerFn({ method: "POST" })
  .inputValidator((data: { title: string; descriptionHtml?: string }) => data)
  .handler(async ({ data }) => {
    const query = `
      mutation collectionCreate($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title: data.title,
        descriptionHtml: data.descriptionHtml,
      },
    };

    const result = await shopifyAdminFetch<{ collectionCreate: any }>({ query, variables });
    return result.data.collectionCreate;
  });
