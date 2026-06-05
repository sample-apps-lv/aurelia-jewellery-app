import { isMock } from "./fetch-api";
import { PRODUCTS } from "@/features/catalog/data/mock-products";

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

const MOCK_HOMEPAGE_CONFIG: HomepageConfig = {
  header: {
    logoText: "GAJANAND",
    searchPlaceholder: "Search for jewellery...",
    findStoreLabel: "Find a store",
    wishlistLabel: "Wishlist",
    cartLabel: "Cart",
    profileLabel: "Profile",
    moreLabel: "More",
    navLeft: [], // Will be filled by defaults in Header
    navRight: []
  },
  hero: {
    badge: "EXCLUSIVE COLLECTION",
    heading: "Timeless Noir & Gold",
    subheading: "Discover the perfect blend of tradition and modern elegance with our handcrafted fine jewelry.",
    videoUrl: "",
    ctaPrimaryText: "Explore Collection",
    ctaPrimaryLink: "/catalog/rings"
  },
  promos: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80",
      title: "Festive Gold Upgrade",
      subtitle: "Exchange your old gold for new designs",
      cta: "Learn More",
      bgColor: "bg-[#93709B]"
    }
  ],
  enrollPlan: {
    title: "Enrol in our 10+1 Monthly Plan",
    highlight: "10+1",
    description: "Save monthly and get one installment free on us.",
    ctaText: "Enrol Now"
  },
  promises: [
    { title: "100% Certified", desc: "Authenticity Guaranteed", icon: "ShieldCheck" },
    { title: "Lifetime Exchange", desc: "Buy-back Policy", icon: "RefreshCw" },
    { title: "Free Shipping", desc: "Insured Delivery", icon: "Truck" },
    { title: "30-Day Returns", desc: "Money Back Guarantee", icon: "Star" }
  ]
};

export async function getHomepageConfig(): Promise<HomepageConfig | null> {
  if (isMock()) return MOCK_HOMEPAGE_CONFIG;

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
    const node = response.data?.metaobjects?.nodes?.[0];
    
    if (!node) {
      console.warn("No homepage_settings metaobject found via Storefront API.");
      return MOCK_HOMEPAGE_CONFIG;
    }

    const configField = node.fields?.find((f: any) => f.key === "config");
    if (!configField) {
      console.warn("No 'config' field found in metaobject node.");
      return MOCK_HOMEPAGE_CONFIG;
    }

    return JSON.parse(configField.value);
  } catch (error) {
    console.error("Error fetching homepage config:", error);
    return MOCK_HOMEPAGE_CONFIG;
  }
}

export async function getCollectionProducts(collectionId: string): Promise<ShopifyProduct[]> {
  if (isMock()) {
    return PRODUCTS.slice(0, 8).map(p => ({
      id: p.id,
      title: p.title,
      handle: p.slug,
      featuredImage: {
        url: p.images[0],
        altText: p.title
      }
    }));
  }

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

  try {
    const response = await shopifyFetch<{ collection: { products: { nodes: ShopifyProduct[] } } }>({
      query,
      variables: { id: `gid://shopify/Collection/${collectionId}` },
    });

    return response.data?.collection?.products?.nodes || [];
  } catch (error) {
    console.error("Error fetching collection products:", error);
    return [];
  }
}

export async function getAllProducts() {
  if (isMock()) {
    return PRODUCTS.map(p => ({
      ...p,
      stock: 10,
      isBestseller: p.isBestseller || false,
      rating: 4.8,
      reviews: 24,
    }));
  }

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

  try {
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
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export interface MetalRates {
  gold_24k: number;
  gold_22k: number;
  gold_18k: number;
  gold_14k: number;
  silver: number;
  lastUpdated: string;
}

const MOCK_METAL_RATES: MetalRates = {
  gold_24k: 6500,
  gold_22k: 6000,
  gold_18k: 5000,
  gold_14k: 4000,
  silver: 75,
  lastUpdated: new Date().toISOString()
};

export async function getMetalRates(): Promise<MetalRates | null> {
  if (isMock()) return MOCK_METAL_RATES;

  const query = `
    query getMetalRates {
      metaobjects(type: "metal_rates", first: 1) {
        nodes {
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
    const node = response.data?.metaobjects?.nodes?.[0];
    
    if (!node) {
      console.warn("No metal_rates metaobject found.");
      return MOCK_METAL_RATES;
    }

    const rates: any = {};
    node.fields?.forEach((f: any) => {
      if (f.key === "last_updated") {
        rates.lastUpdated = f.value;
      } else {
        rates[f.key] = parseFloat(f.value);
      }
    });

    return rates as MetalRates;
  } catch (error) {
    console.error("Error fetching metal rates:", error);
    return MOCK_METAL_RATES;
  }
}
