import { Link } from "@tanstack/react-router";

interface PricePoint {
  label: string;
  to: string;
}

interface ShopByPriceProps {
  pricePoints?: PricePoint[];
}

const DEFAULT_PRICE_POINTS: PricePoint[] = [
  { label: "Under 10k", to: "/catalog/rings" },
  { label: "10k - 20k", to: "/catalog/rings" },
  { label: "20k - 30k", to: "/catalog/rings" },
  { label: "30k - 50k", to: "/catalog/rings" },
  { label: "Above 50k", to: "/catalog/rings" },
];

export function ShopByPrice({ pricePoints }: ShopByPriceProps) {
  const points = pricePoints && pricePoints.length > 0 ? pricePoints : DEFAULT_PRICE_POINTS;

  return (
    <section className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Shop by Price</h2>
          <div className="w-20 h-1 bg-gold mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 md:gap-4">
          {points.map((price) => (
            <Link
              key={price.label}
              to={price.to as any}
              className="px-4 md:px-8 py-3 bg-white border border-border hover:border-gold hover:text-gold transition-all text-xs md:text-sm font-medium text-center"
            >
              {price.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
