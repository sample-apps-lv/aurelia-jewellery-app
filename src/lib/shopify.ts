const domain = import.meta.env.VITE_SHOPIFY_SHOP_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<{ data: T } | never> {
  if (!domain || !storefrontAccessToken) {
    console.warn("Shopify domain or access token is missing. Please check your .env file.");
    return { data: {} as T };
  }

  try {
    const endpoint = `https://${domain}/api/2024-01/graphql.json`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching from Shopify:", error);
    throw error;
  }
}

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  featuredImage: {
    url: string;
    altText: string;
  } | null;
};

export async function getCollectionProducts(collectionId: string): Promise<ShopifyProduct[]> {
  const query = `
    query getCollectionProducts($id: ID!) {
      collection(id: $id) {
        products(first: 16) {
          nodes {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ collection: { products: { nodes: ShopifyProduct[] } } }>({
    query,
    variables: { id: `gid://shopify/Collection/${collectionId}` },
  });

  return response.data?.collection?.products?.nodes || [];
}
