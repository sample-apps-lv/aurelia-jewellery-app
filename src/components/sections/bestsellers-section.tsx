import { ProductCard } from "@/features/catalog/components/product-card";
import { Button } from "@/components/ui/button";

interface BestsellersSectionProps {
  products: any[];
}

export function BestsellersSection({ products }: BestsellersSectionProps) {
  console.log({products})
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif mb-4">Trending Now</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most loved pieces from our current collection, chosen by you.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.slice(0, 4).map((p, i) => (
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
  );
}
