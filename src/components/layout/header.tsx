import * as React from "react";
import { Link } from "@tanstack/react-router";
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
  Info
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
import { useQuery } from "@tanstack/react-query";
import { getHomepageConfig } from "@/lib/shopify";
import { motion, AnimatePresence } from "framer-motion";

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
  const { data: config } = useQuery({
    queryKey: ["homepage-config"],
    queryFn: getHomepageConfig,
  });

  const [showHeader, setShowHeader] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
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

  const navLeft = config?.header?.navLeft || DEFAULT_NAV_LEFT;
  const navRight = config?.header?.navRight || DEFAULT_NAV_RIGHT;
  const logoText = config?.header?.logoText || DEFAULT_HEADER_CONFIG.logoText;
  const searchPlaceholder = config?.header?.searchPlaceholder || DEFAULT_HEADER_CONFIG.searchPlaceholder;
  const findStoreLabel = config?.header?.findStoreLabel || DEFAULT_HEADER_CONFIG.findStoreLabel;
  const wishlistLabel = config?.header?.wishlistLabel || DEFAULT_HEADER_CONFIG.wishlistLabel;
  const cartLabel = config?.header?.cartLabel || DEFAULT_HEADER_CONFIG.cartLabel;
  const profileLabel = config?.header?.profileLabel || DEFAULT_HEADER_CONFIG.profileLabel;
  const moreLabel = config?.header?.moreLabel || DEFAULT_HEADER_CONFIG.moreLabel;

  const ActionItem = ({ icon: Icon, label, onClick, to, badge }: any) => {
    const content = (
      <div className="flex flex-col items-center gap-1 group cursor-pointer min-w-[70px]">
        <div className="relative">
          <Icon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {badge}
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
          {label}
        </span>
      </div>
    );

    if (to) return <Link to={to}>{content}</Link>;
    return <button onClick={onClick}>{content}</button>;
  };

  const NavItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    if (!item.subItems && !item.type) {
      return (
        <Link 
          to={item.url || "/"} 
          className="flex items-center gap-1.5 text-[11px] font-bold py-3 px-2 hover:text-white/80 transition-colors whitespace-nowrap outline-none"
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
          <DropdownMenuTrigger className="flex items-center gap-1.5 text-[11px] font-bold py-3 px-2 hover:text-white/80 transition-colors whitespace-nowrap outline-none">
            {item.label}
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className={cn(
              "bg-white border-none rounded-none shadow-2xl mt-[-4px] p-0 overflow-hidden",
              item.type === "mega" ? "w-[1000px] left-[-200px]" : "w-48"
            )}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {item.type === "mega" ? (
              <div className="flex divide-x divide-slate-100">
                <div className="grid grid-cols-3 flex-grow p-6 gap-8">
                  {item.columns?.map((col: any) => (
                    <div key={col.title} className="flex flex-col items-center text-center">
                      <h4 className="text-[#001938] font-serif text-lg mb-4 self-start border-b border-slate-100 w-full text-left pb-2">{col.title}</h4>
                      <div className="relative aspect-square w-full mb-4 group/img">
                        <img src={col.image} alt={col.title} className="w-full h-full object-contain" />
                      </div>
                      <Link 
                        to="/catalog/$category" 
                        params={{ category: item.category }}
                        className="w-full border border-[#001938] text-[#001938] py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#001938] hover:text-white transition-all group/link"
                      >
                        {col.linkText} <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  ))}
                </div>
                {item.education && (
                  <div className="w-64 p-6 bg-white">
                    <h4 className="text-[#001938] font-serif text-lg mb-6 border-b border-slate-100 pb-2">{item.education.title}</h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      {item.education.items.map((edu: any) => {
                        const Icon = ICON_MAP[edu.icon] || Info;
                        return (
                          <div key={edu.label} className="flex items-center gap-3 group/edu cursor-pointer">
                            <div className={cn("p-2 rounded-full bg-orange-50 transition-colors group-hover/edu:bg-orange-100", edu.color)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-medium text-slate-600 group-hover/edu:text-primary transition-colors">{edu.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              item.subItems?.map((sub: { label: string, url: string }) => (
                <DropdownMenuItem key={sub.label} asChild>
                  <Link
                    to={sub.url as any}
                    className="block px-4 py-2.5 text-[11px] font-medium hover:bg-slate-50 hover:text-primary transition-colors border-b last:border-0 border-slate-100 cursor-pointer"
                  >
                    {sub.label}
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-sm">
      {/* Top Section */}
      <motion.div
        initial={false}
        animate={{ 
          height: showHeader ? 72 : 0, 
          opacity: showHeader ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-white"
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-[72px] gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-primary text-white p-1 rounded-sm">
                <span className="font-serif font-bold text-xl leading-none">GS</span>
              </div>
              <span className="font-serif text-xl md:text-2xl tracking-[0.1em] text-[#1e2d48] font-bold uppercase">
                {logoText}
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-grow max-w-[600px] relative">
              <Input 
                type="text" 
                placeholder={searchPlaceholder}
                className="w-full bg-white border-[#b0b0b0] rounded-[4px] pl-10 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Action Icons */}
            <div className="flex items-center">
              <ActionItem icon={MapPin} label={findStoreLabel} to="/account" />
              <ActionItem icon={Heart} label={wishlistLabel} to="/account" />
              <ActionItem icon={ShoppingBag} label={cartLabel} onClick={open} badge={count} />
              <ActionItem icon={User} label={profileLabel} to="/account" />
              <ActionItem icon={MoreVertical} label={moreLabel} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Bar */}
      <div className="bg-[#001938] text-white border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between min-h-[44px]">
          <div className="flex items-center gap-4">
            {navLeft.map((n: any) => (
              <NavItem key={n.label} item={n} />
            ))}
          </div>
          <div className="flex items-center gap-4">
            {navRight.map((n: any) => (
              <NavItem key={n.label} item={n} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
