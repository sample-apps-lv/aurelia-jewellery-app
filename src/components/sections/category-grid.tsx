import { Link } from "@tanstack/react-router";

interface CategoryGridProps {
  items: Array<{
    title: string;
    image: string;
    to: string;
  }>;
}

export function CategoryGrid({ items }: CategoryGridProps) {
  if (!items?.length) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-square w-full rounded-[20px] bg-[#fff5f5] overflow-hidden border border-transparent group-hover:border-[#ffdada] transition-colors p-2 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain mix-blend-multiply rounded-[14px]"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-[14px]">
                    <span className="text-[10px] text-muted-foreground uppercase">No Image</span>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-[#444] text-center group-hover:text-primary transition-colors uppercase tracking-tight">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
