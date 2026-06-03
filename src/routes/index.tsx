import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/features/catalog/api/use-products";
import { CategoryGrid } from "@/components/sections/category-grid";
import { PromoCarousel } from "@/components/sections/promo-carousel";
import { EnrollPlanSection } from "@/components/sections/enroll-plan-section";
import { CollectionsSection } from "@/components/sections/collections-section";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustBar } from "@/components/sections/trust-bar";
import { ShopByPrice } from "@/components/sections/shop-by-price";
import { BestsellersSection } from "@/components/sections/bestsellers-section";
import { PromisesSection } from "@/components/sections/promises-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { useQuery } from "@tanstack/react-query";
import { getCollectionProducts, getHomepageConfig } from "@/lib/shopify";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gajanand Jewellers — Exquisite Gold & Diamond Jewelry" },
      { name: "description", content: "Shop the latest in fine jewelry. From diamond rings to gold necklaces, find the perfect piece for every occasion." },
    ],
  }),
  component: Index,
});

const CATEGORY_COLLECTION_ID = "337363632317";

function Index() {
  const { data: config } = useQuery({
    queryKey: ["homepage-config"],
    queryFn: getHomepageConfig,
  });

  const { data: categoryItems = [] } = useQuery({
    queryKey: ["category-collection-products", CATEGORY_COLLECTION_ID],
    queryFn: () => getCollectionProducts(CATEGORY_COLLECTION_ID),
  });
  
  const { data: products = [] } = useProducts();
  console.log({"productsproducts": products})
  const bestsellers = products.filter((p) => p.isBestseller);

  const hero = config?.hero;
  const promos = config?.promos || [];
  const enrollPlan = config?.enrollPlan;
  const promises = config?.promises || [];

  return (
    <div className="bg-white">
      {/* Hero Video Section */}
      <HeroSection hero={hero} />

      {/* Category Grid Section */}
      <CategoryGrid items={categoryItems} />

      {/* Promo Carousel Section */}
      <PromoCarousel items={promos} />

      {/* Enroll Plan Section */}
      {enrollPlan && <EnrollPlanSection data={enrollPlan} />}

      {/* Collections Section */}
      <CollectionsSection />

      {/* Trust Bar */}
      <TrustBar />

      {/* Shop by Price */}
      <ShopByPrice />

      {/* Bestsellers */}
      <BestsellersSection products={bestsellers} />

      {/* The BlueStone Promise (Icon Grid) */}
      <PromisesSection promises={promises} />

      {/* Social Proof */}
      <SocialProofSection videoUrl={hero?.videoUrl} />
    </div>
  );
}
