import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Heart, User, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/features/cart/store/use-cart";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Rings", to: "/catalog/rings" },
  { label: "Necklaces", to: "/catalog/necklaces" },
  { label: "Earrings", to: "/catalog/earrings" },
  { label: "Bracelets", to: "/catalog/bracelets" },
  { label: "Bridal", to: "/catalog/bridal" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isHome = path === "/";
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-500",
        transparent
          ? "bg-transparent text-white"
          : "bg-background/95 backdrop-blur-md text-foreground border-b border-border",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-3 items-center h-20">
          <nav className="hidden lg:flex items-center gap-7 text-xs tracking-luxe">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="hover:text-gold transition-colors"
                activeProps={{ className: "text-gold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="lg:hidden flex">
            <Link to="/catalog/$category" params={{ category: "rings" }} className="text-xs tracking-luxe hover:text-gold">
              Shop
            </Link>
          </div>

          <Link to="/" className="justify-self-center">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.3em]">
              AURELIA
            </span>
          </Link>

          <div className="justify-self-end flex items-center gap-4">
            <button aria-label="Search" className="hover:text-gold transition-colors">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link to="/account" aria-label="Wishlist" className="hover:text-gold transition-colors hidden sm:block">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/account" aria-label="Account" className="hover:text-gold transition-colors hidden sm:block">
              <User className="h-[18px] w-[18px]" />
            </Link>
            <button
              onClick={open}
              aria-label="Cart"
              className="relative hover:text-gold transition-colors"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-noir text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
