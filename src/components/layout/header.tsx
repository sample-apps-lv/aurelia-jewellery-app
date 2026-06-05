import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  History, 
  Video, 
  MapPin, 
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Gem,
  Award,
  Zap,
  Maximize,
  Info,
  X,
  Menu
} from "lucide-react";
import { useCart } from "@/features/cart/store/use-cart";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getHomepageConfig } from "@/lib/shopify";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/features/catalog/api/use-products";
import { useIsMobile } from "@/hooks/use-mobile";

import { 
  DEFAULT_NAV_LEFT, 
  DEFAULT_NAV_RIGHT, 
  DEFAULT_HEADER_CONFIG 
} from "@/features/catalog/data/navigation";

const ICON_MAP: Record<string, any> = {
  Gem,
  Award,
  Zap,
  Maximize,
  Info,
  Heart
};

export function Header() {
  const isMobile = useIsMobile();
  const { data: config } = useQuery({
    queryKey: ["homepage-config"],
    queryFn: getHomepageConfig,
  });

  const { data: products = [] } = useProducts();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { allMatches, filteredProducts } = React.useMemo(() => {
    if (!searchQuery.trim()) return { allMatches: [], filteredProducts: [] };
    
    const matches = products.filter((p) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      allMatches: matches,
      filteredProducts: matches.slice(0, 20)
    };
  }, [searchQuery, products]);

  // Close search results on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showHeader, setShowHeader] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
        setIsMobileSearchOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);

  const navLeft = config?.header?.navLeft?.length ? config.header.navLeft : DEFAULT_NAV_LEFT;
  const navRight = config?.header?.navRight?.length ? config.header.navRight : DEFAULT_NAV_RIGHT;
  const logoText = config?.header?.logoText || DEFAULT_HEADER_CONFIG.logoText;
  const searchPlaceholder = config?.header?.searchPlaceholder || DEFAULT_HEADER_CONFIG.searchPlaceholder;
  const findStoreLabel = config?.header?.findStoreLabel || DEFAULT_HEADER_CONFIG.findStoreLabel;
  const wishlistLabel = config?.header?.wishlistLabel || DEFAULT_HEADER_CONFIG.wishlistLabel;
  const cartLabel = config?.header?.cartLabel || DEFAULT_HEADER_CONFIG.cartLabel;
  const profileLabel = config?.header?.profileLabel || DEFAULT_HEADER_CONFIG.profileLabel;
  const moreLabel = config?.header?.moreLabel || DEFAULT_HEADER_CONFIG.moreLabel;

  const allNavItems = [...navLeft, ...navRight];

  const ActionItem = ({ icon: Icon, label, onClick, to, badge, hideLabelOnMobile = true }: any) => {
    const content = (
      <div className="flex flex-col items-center gap-1 group cursor-pointer min-w-[45px] sm:min-w-[60px] lg:min-w-[70px]">
        <div className="relative">
          <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-foreground group-hover:text-primary transition-colors" />
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {badge}
            </span>
          )}
        </div>
        <span className={cn(
          "text-[9px] lg:text-[10px] text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap",
          hideLabelOnMobile && "hidden lg:block"
        )}>
          {label}
        </span>
      </div>
    );

    if (to) return <Link to={to}>{content}</Link>;
    return <button onClick={onClick}>{content}</button>;
  };

  const MobileNavItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="border-b border-slate-100 last:border-0">
        <div 
          className="flex items-center justify-between py-4 px-4 sm:px-6 cursor-pointer"
          onClick={() => item.subItems || item.columns ? setIsOpen(!isOpen) : navigate({ to: item.url || "/" })}
        >
          <span className="text-sm font-bold text-[#001938] uppercase tracking-wide">{item.label}</span>
          {(item.subItems || item.columns) && (
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
          )}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-slate-50"
            >
              <div className="p-4 sm:p-6 space-y-4">
                {item.subItems?.map((sub: any) => (
                  <Link 
                    key={sub.label} 
                    to={sub.url} 
                    className="block text-sm text-slate-600 hover:text-primary transition-colors"
                  >
                    {sub.label}
                  </Link>
                ))}
                {item.columns?.map((col: any) => (
                  <div key={col.title} className="space-y-2 pt-2 border-t border-slate-200 first:border-0 first:pt-0">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{col.title}</h4>
                    <Link 
                      to="/catalog/$category" 
                      params={{ category: item.category }}
                      className="text-sm text-slate-600 hover:text-primary block font-medium"
                    >
                      {col.linkText}
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const NavItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    if (!item.subItems && !item.type) {
      return (
        <Link 
          to={item.url || "/"} 
          className="flex items-center gap-1.5 text-[10px] xl:text-[11px] font-bold py-3 px-1.5 xl:px-3 hover:text-white/80 transition-colors whitespace-nowrap outline-none uppercase tracking-wider"
        >
          {item.label}
        </Link>
      );
    }

    return (
      <div 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative"
      >
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="flex items-center gap-1 xl:gap-1.5 text-[10px] xl:text-[11px] font-bold py-3 px-1.5 xl:px-3 hover:text-white/80 transition-colors whitespace-nowrap outline-none uppercase tracking-wider">
            {item.label}
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className={cn(
              "bg-white border-none rounded-none shadow-2xl mt-[-4px] p-0 overflow-hidden",
              item.type === "mega" ? "w-[90vw] max-w-[1200px] absolute left-1/2 -translate-x-1/2" : "w-48"
            )}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {item.type === "mega" ? (
              <div className="flex divide-x divide-slate-100">
                <div className="grid grid-cols-3 flex-grow p-6 xl:p-10 gap-8 xl:gap-12">
                  {item.columns?.map((col: any) => (
                    <div key={col.title} className="flex flex-col items-center text-center">
                      <h4 className="text-[#001938] font-serif text-lg xl:text-xl mb-4 self-start border-b border-slate-100 w-full text-left pb-2">{col.title}</h4>
                      <div className="relative aspect-square w-full mb-6 group/img overflow-hidden rounded-lg">
                        <img src={col.image} alt={col.title} className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-105" />
                      </div>
                      <Link 
                        to="/catalog/$category" 
                        params={{ category: item.category }}
                        className="w-full border border-[#001938] text-[#001938] py-2.5 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#001938] hover:text-white transition-all group/link shadow-sm hover:shadow-md"
                      >
                        {col.linkText} <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  ))}
                </div>
                {item.education && (
                  <div className="w-72 xl:w-80 p-6 xl:p-10 bg-slate-50/50">
                    <h4 className="text-[#001938] font-serif text-lg xl:text-xl mb-8 border-b border-slate-200 pb-2">{item.education.title}</h4>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                      {item.education.items.map((edu: any) => {
                        const Icon = ICON_MAP[edu.icon] || Info;
                        return (
                          <div key={edu.label} className="flex items-center gap-3 group/edu cursor-pointer">
                            <div className={cn("p-2.5 rounded-full bg-white shadow-sm transition-all group-hover/edu:shadow-md group-hover/edu:scale-110", edu.color)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] xl:text-[12px] font-semibold text-slate-600 group-hover/edu:text-primary transition-colors">{edu.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-2">
                {item.subItems?.map((sub: { label: string, url: string }) => (
                  <DropdownMenuItem key={sub.label} asChild>
                    <Link
                      to={sub.url as any}
                      className="block px-5 py-3 text-[11px] font-semibold hover:bg-slate-50 hover:text-primary transition-colors border-b last:border-0 border-slate-50 cursor-pointer"
                    >
                      {sub.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const SearchResults = () => (
    <AnimatePresence>
      {isSearchFocused && searchQuery.trim() !== "" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-xl border border-slate-100 overflow-hidden z-[60]"
        >
          <div className="max-h-[400px] overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Products</p>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onClick={() => {
                      setIsSearchFocused(false);
                      setIsMobileSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors group"
                  >
                    <div className="h-12 w-12 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {product.rating} ★
                    </div>
                  </Link>
                ))}
                <div className="p-3 border-t border-slate-50 mt-1">
                   <button className="w-full text-center text-xs font-bold text-primary hover:underline">
                      View all {allMatches.length} results
                   </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No products found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header 
      className={cn(
        "fixed top-0 inset-x-0 z-50 bg-white shadow-sm transition-transform duration-300 ease-in-out",
        showHeader ? "translate-y-0" : "-translate-y-[100%]"
      )}
    >
      {/* Top Section */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[64px] lg:h-[80px] gap-2 lg:gap-8">
            
            {/* Mobile/Tablet Menu Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 hover:bg-slate-50 rounded-md transition-colors">
                    <Menu className="h-6 w-6 text-[#001938]" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto">
                  <SheetHeader className="p-6 border-b border-slate-100 text-left bg-slate-50">
                    <SheetTitle className="font-serif text-2xl font-bold text-[#001938] tracking-tight">
                      {logoText}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-2">
                    <div className="px-2 mb-4">
                      <p className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Navigation</p>
                      <div className="flex flex-col">
                        {navLeft.map((n: any) => (
                          <MobileNavItem key={n.label} item={n} />
                        ))}
                        {navRight.map((n: any) => (
                          <MobileNavItem key={n.label} item={n} />
                        ))}
                      </div>
                    </div>
                    <div className="px-6 py-6 border-t border-slate-100 space-y-5">
                      <Link to="/account" className="flex items-center gap-4 text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                        <User className="w-5 h-5 opacity-70" /> My Profile
                      </Link>
                      <Link to="/account" className="flex items-center gap-4 text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                        <Heart className="w-5 h-5 opacity-70" /> My Wishlist
                      </Link>
                      <Link to="/account" className="flex items-center gap-4 text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                        <MapPin className="w-5 h-5 opacity-70" /> Find a Store
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 lg:gap-3 flex-shrink-0 group">
              <div className="bg-primary text-white p-1.5 rounded-sm hidden sm:block group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif font-bold text-xl lg:text-2xl leading-none">GS</span>
              </div>
              <span className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-[0.15em] text-[#1e2d48] font-black uppercase truncate max-w-[140px] sm:max-w-none">
                {logoText}
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-grow max-w-[500px] xl:max-w-[650px] relative" ref={searchRef}>
              <div className="relative">
                <Input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-slate-50 border-slate-200 rounded-full pl-12 h-11 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-primary transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <SearchResults />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-0 lg:gap-2">
              <button 
                className="lg:hidden p-2 hover:bg-slate-50 rounded-md transition-colors"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Search className="h-6 w-6 text-[#001938]" />
              </button>
              <ActionItem icon={MapPin} label={findStoreLabel} to="/account" />
              <ActionItem icon={Heart} label={wishlistLabel} to="/account" />
              <ActionItem icon={ShoppingBag} label={cartLabel} onClick={open} badge={count} />
              <ActionItem icon={User} label={profileLabel} to="/account" />
              <ActionItem icon={MoreVertical} label={moreLabel} className="hidden lg:flex" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Search Bar Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 px-4 py-4"
          >
            <div className="relative" ref={searchRef}>
              <Input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={searchPlaceholder}
                className="w-full bg-slate-50 border-none rounded-lg pl-10 h-12 text-base focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <SearchResults />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Category Scroll */}
      <div className="lg:hidden bg-white border-t border-slate-100 overflow-x-auto no-scrollbar py-3 shadow-inner">
        <div className="flex px-4 gap-6 min-w-max">
          {allNavItems.map((item: any) => (
            <Link
              key={item.label}
              to={item.url || "/catalog/$category"}
              params={item.url ? undefined : { category: item.category }}
              className="text-[11px] font-bold text-[#001938] uppercase tracking-[0.15em] whitespace-nowrap hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Bar (Desktop/Large) */}
      <div className="hidden lg:block bg-[#001938] text-white border-t border-white/10 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between min-h-[48px]">
          <div className="flex items-center gap-2 xl:gap-6">
            {navLeft.map((n: any) => (
              <NavItem key={n.label} item={n} />
            ))}
          </div>
          <div className="flex items-center gap-2 xl:gap-6">
            {navRight.map((n: any) => (
              <NavItem key={n.label} item={n} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
