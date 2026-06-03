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

export interface HomepageConfig {
  header: {
    logoText: string;
    searchPlaceholder: string;
    findStoreLabel: string;
    wishlistLabel: string;
    cartLabel: string;
    profileLabel: string;
    moreLabel: string;
    navLeft: Array<{
      label: string;
      category: string;
      subItems?: Array<{ label: string; url: string }>;
      type?: "mega";
      columns?: Array<{
        title: string;
        image: string;
        buttonText: string;
        linkText: string;
      }>;
      education?: {
        title: string;
        items: Array<{
          label: string;
          icon: string;
          color: string;
        }>;
      };
    }>;
    navRight: Array<{
      label: string;
      category: string;
      subItems?: Array<{ label: string; url: string }>;
    }>;
  };
  hero: {
    badge: string;
    heading: string;
    subheading: string;
    videoUrl: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
  };
  promos: Array<{
    id: number;
    image: string;
    title: string;
    subtitle: string;
    cta: string;
    bgColor: string;
  }>;
  enrollPlan: {
    title: string;
    highlight: string;
    description: string;
    ctaText: string;
  };
  promises: Array<{
    title: string;
    desc: string;
    icon: string;
  }>;
}

export async function getHomepageConfig(): Promise<HomepageConfig | null> {
  const query = `
    query getHomepageConfig {
      metaobjects(type: "homepage_settings", first: 1) {
        nodes {
          handle
          fields {
            key
            value
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<{ metaobjects: { nodes: any[] } }>({ query });
    console.log("Storefront API metaobjects response:", JSON.stringify(response.data?.metaobjects, null, 2));
    const node = response.data?.metaobjects?.nodes[0];
    
    if (!node) {
      console.warn("No homepage_settings metaobject found via Storefront API.");
      return null;
    }

    const configField = node.fields.find((f: any) => f.key === "config");
    if (!configField) {
      console.warn("No 'config' field found in metaobject node.");
      return null;
    }

    return JSON.parse(configField.value);
  } catch (error) {
    console.error("Error fetching homepage config:", error);
    return null;
  }
}

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

export async function getAllProducts() {
  const query = `
    query getAllProducts {
      products(first: 50) {
        nodes {
          id
          title
          handle
          description
          productType
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            nodes {
              url
              altText
            }
          }
          collections(first: 1) {
            nodes {
              title
              handle
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ products: { nodes: any[] } }>({ query });
  const nodes = response.data?.products?.nodes || [];

  return nodes.map((node) => ({
    id: node.id,
    title: node.title,
    slug: node.handle,
    description: node.description,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    images: node.images.nodes.map((img: any) => img.url),
    category: node.collections.nodes[0]?.title || node.productType || "Jewellery",
    stock: 10, // Mock stock as it's not in Storefront API
    isBestseller: node.collections.nodes.some((c: any) => c.handle === "bestsellers") || false,
    rating: 4.8,
    reviews: 24,
  }));
}
