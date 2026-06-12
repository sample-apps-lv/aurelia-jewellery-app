import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/features/catalog/api/use-products";
import { CategoryGrid } from "@/components/sections/category-grid";
import { PromoCarousel } from "@/components/sections/promo-carousel";
import { GiftSelectionSection } from "@/components/sections/gift-selection-section";
import { EnrollPlanSection } from "@/components/sections/enroll-plan-section";
import { CollectionsSection } from "@/components/sections/collections-section";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustBar } from "@/components/sections/trust-bar";
import { ShopByPrice } from "@/components/sections/shop-by-price";
import { BestsellersSection } from "@/components/sections/bestsellers-section";
import { PromisesSection } from "@/components/sections/promises-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { BlogSection } from "@/features/blog/components/blog-section";
import { useQuery } from "@tanstack/react-query";
import { getHomepageConfig } from "@/lib/shopify";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gajanand Jewellers — Exquisite Gold & Diamond Jewelry" },
      { name: "description", content: "Shop the latest in fine jewelry. From diamond rings to gold necklaces, find the perfect piece for every occasion." },
    ],
  }),
  component: Index,
});


function Index() {
  const { data: config } = useQuery({
    queryKey: ["homepage-config"],
    queryFn: getHomepageConfig,
  });

  
  const { data: products = [] } = useProducts();
  const bestsellers = products.filter((p) => p.isBestseller);

  const hero = config?.hero;
  const categoryGrid = config?.categoryGrid || [];
  const promos = config?.promos || [];
  const enrollPlan = config?.enrollPlan;
  const promises = config?.promises || [];
  const giftSection = config?.giftSection;
  const collections = config?.collections;
  const trustBarItems = config?.trustBar;
  const shopByPricePoints = config?.shopByPrice;
  const socialProof = config?.socialProof;

  return (
    <div className="bg-white">
      {/* Hero Video Section */}
      <HeroSection hero={hero} />

      {/* Category Grid Section */}
      <CategoryGrid items={categoryGrid} />

      {/* Promo Carousel Section */}
      <PromoCarousel items={promos} />

      {/* Gift Selection Section */}
      <GiftSelectionSection
        categories={giftSection?.categories}
        giftPoints={giftSection?.giftPoints}
      />

      {/* Enroll Plan Section */}
      {enrollPlan && <EnrollPlanSection data={enrollPlan} />}

      {/* Collections Section */}
      <CollectionsSection collections={collections} />

      {/* Trust Bar */}
      <TrustBar items={trustBarItems} />

      {/* Shop by Price */}
      <ShopByPrice pricePoints={shopByPricePoints} />

      {/* Bestsellers */}
      <BestsellersSection products={bestsellers} />

      {/* The Promise Section (Icon Grid) */}
      <PromisesSection promises={promises} />

      {/* Social Proof */}
      <SocialProofSection videoUrl={hero?.videoUrl} socialProof={socialProof} />

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
}
