import { Link } from "@tanstack/react-router";
import catEveryday from "@/assets/cat-everyday.jpg";
import catStatement from "@/assets/cat-statement.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import { Button } from "@/components/ui/button";

const COLLECTIONS = [
  {
    title: "DAINTY DREAMS",
    subtitle: "SOFT MOMENTS, BEAUTIFULLY CRAFTED",
    image: catEveryday,
    to: "/catalog/rings"
  },
  {
    title: "RAW REVERIE",
    subtitle: "NATURE'S UNTAMED ELEGANCE",
    image: catStatement,
    to: "/catalog/necklaces"
  },
  {
    title: "CLAY WHISPERS",
    subtitle: "EARTHY SOUL, GOLDEN TOUCH",
    image: catBridal,
    to: "/catalog/earrings"
  }
];

export function CollectionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-[#001938] text-2xl md:text-3xl font-serif font-semibold">
            Browse Latest Jewellery Collections
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.title}
              to={col.to as any}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                <h3 className="text-3xl md:text-4xl font-serif tracking-[0.1em] leading-tight mb-2">
                  {col.title}
                </h3>
                <p className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] opacity-90 uppercase">
                  {col.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            className="bg-[#fff1f2] border-none text-[#001938] hover:bg-[#ffe4e6] font-bold px-10 py-6 rounded-md shadow-sm transition-all text-sm"
            asChild
          >
            <Link to="/catalog/rings">Browse all Collections</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
