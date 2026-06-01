import { Link } from "@tanstack/react-router";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import catEveryday from "@/assets/cat-everyday.jpg";
import catStatement from "@/assets/cat-statement.jpg";

const CATEGORIES = [
  { name: "Watch Jewellery", image: p1, to: "/catalog/bracelets" },
  { name: "Solitaires", image: p2, to: "/catalog/rings" },
  { name: "Mangalsutras", image: p3, to: "/catalog/necklaces" },
  { name: "Men's Jewellery", image: p4, to: "/catalog/rings" },
  { name: "Kids Jewellery", image: p5, to: "/catalog/earrings" },
  { name: "Nose Pins", image: p6, to: "/catalog/earrings" },
  { name: "Anklets", image: catBridal, to: "/catalog/bracelets" },
  { name: "Gold Coins", image: catEveryday, to: "/catalog/rings" },
  { name: "Gifts", image: catStatement, to: "/catalog/rings" },
  { name: "Rings", image: p1, to: "/catalog/rings" },
  { name: "Pendants", image: p2, to: "/catalog/necklaces" },
  { name: "Earrings", image: p3, to: "/catalog/earrings" },
  { name: "Necklaces", image: p4, to: "/catalog/necklaces" },
  { name: "Bracelets", image: p5, to: "/catalog/bracelets" },
  { name: "Bangles", image: p6, to: "/catalog/bracelets" },
  { name: "Kada", image: catBridal, to: "/catalog/bracelets" },
  // { name: "Gold Chains", image: catEveryday, to: "/catalog/necklaces" },
  // { name: "All Jewellery", image: catStatement, to: "/catalog/rings" },
];

export function CategoryGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to as any}
              className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-square w-full rounded-[20px] bg-[#fff5f5] overflow-hidden border border-transparent group-hover:border-[#ffdada] transition-colors p-2 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply rounded-[14px]"
                />
              </div>
              <span className="text-[11px] font-bold text-[#444] text-center group-hover:text-primary transition-colors uppercase tracking-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
