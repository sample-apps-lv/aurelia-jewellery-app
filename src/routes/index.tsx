import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  Star, 
  ChevronRight,
  Video,
  MapPin,
  Smartphone
} from "lucide-react";
import { useProducts } from "@/features/catalog/api/use-products";
import { ProductCard } from "@/features/catalog/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroVideo from "@/assets/hero.webm";
import { CategoryGrid } from "@/components/sections/category-grid";
import { PromoCarousel } from "@/components/sections/promo-carousel";
import { EnrollPlanSection } from "@/components/sections/enroll-plan-section";
import { CollectionsSection } from "@/components/sections/collections-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gajanand Jewellers — Exquisite Gold & Diamond Jewelry" },
      { name: "description", content: "Shop the latest in fine jewelry. From diamond rings to gold necklaces, find the perfect piece for every occasion." },
    ],
  }),
  component: Index,
});

const PRICE_POINTS = [
  { label: "Under 10k", to: "/catalog/rings" },
  { label: "10k - 20k", to: "/catalog/rings" },
  { label: "20k - 30k", to: "/catalog/rings" },
  { label: "30k - 50k", to: "/catalog/rings" },
  { label: "Above 50k", to: "/catalog/rings" },
];

const PROMISES = [
  { icon: ShieldCheck, title: "100% Certified", desc: "Authenticity Guaranteed" },
  { icon: RefreshCw, title: "Lifetime Exchange", desc: "Buy-back Policy" },
  { icon: Truck, title: "Free Shipping", desc: "Insured Delivery" },
  { icon: Star, title: "30-Day Returns", desc: "Money Back Guarantee" },
];

function Index() {
  const { data: products = [] } = useProducts();
  const bestsellers = products.filter((p) => p.isBestseller);

  return (
    <div className="bg-white">
      {/* Hero Video Section */}
      <section className="relative h-[400px] md:h-[700px] w-full overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center px-6 lg:px-20">
          <div className="max-w-xl text-white">
            <Badge className="mb-4 bg-gold text-white hover:bg-gold-light border-none rounded-none px-4 py-1 text-[10px] font-bold tracking-widest">
              EXCLUSIVE COLLECTION
            </Badge>
            <h2 className="text-4xl md:text-7xl font-serif mb-6 leading-tight">
              Crafting <br /> <span className="text-gold-light italic">Eternal</span> Memories
            </h2>
            <p className="text-lg mb-8 text-white/90 hidden md:block font-light tracking-wide max-w-md">
              Discover our masterfully handcrafted diamond and gold jewellery, where every piece tells a story of timeless beauty.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="cursor-pointer bg-gold hover:bg-gold-light text-white border-none rounded-none px-10 py-6 text-xs uppercase tracking-widest font-bold shadow-lg">
                Explore Collection
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black rounded-none px-10 py-6 text-xs uppercase tracking-widest font-bold backdrop-blur-sm">
                Book Video Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Promo Carousel Section */}
      <PromoCarousel />

      {/* Enroll Plan Section */}
      <EnrollPlanSection />

      {/* Collections Section */}
      <CollectionsSection />

      {/* Trust Bar (Bluestone Style) */}
      <section className="bg-secondary/30 py-4 hidden md:block">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-gold" />
              <span>Free Video Call</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Find a Store</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gold" />
              <span>Try at Home</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>The BlueStone Promise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Price */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Shop by Price</h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {PRICE_POINTS.map((price) => (
              <Link
                key={price.label}
                to={price.to}
                className="px-8 py-3 bg-white border border-border hover:border-gold hover:text-gold transition-all text-sm font-medium"
              >
                {price.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-4">Trending Now</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most loved pieces from our current collection, chosen by you.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {bestsellers.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="rounded-none border-primary px-12 py-6">
              Shop All Bestsellers
            </Button>
          </div>
        </div>
      </section>

      {/* The BlueStone Promise (Icon Grid) */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {PROMISES.map((promise) => (
              <div key={promise.title} className="text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-gold shadow-sm">
                  <promise.icon className="w-8 h-8" />
                </div>
                <h4 className="font-medium text-lg mb-2">{promise.title}</h4>
                <p className="text-sm text-muted-foreground">{promise.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">#GajanandJewellersAndMe</h2>
            <p className="text-muted-foreground">Share your sparkle on Instagram</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square bg-muted relative group overflow-hidden">
                <img 
                  src={heroVideo} 
                  alt="Social Post" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                  <Badge variant="secondary" className="bg-white text-black">Shop the Look</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
