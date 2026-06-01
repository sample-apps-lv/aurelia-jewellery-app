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
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

const NAV_LEFT = [
  { 
    label: "10+1 Monthly Plans", 
    category: "rings",
    subItems: ["Gold Mine", "Gold Reserve", "Flexi Gold"]
  },
  { 
    label: "Watch Jewellery", 
    category: "earrings",
    subItems: ["Men's Watches", "Women's Watches", "Smart Watch Straps"]
  },
  { 
    label: "Rings", 
    category: "rings",
    type: "mega",
    columns: [
      {
        title: "Engagement Rings",
        image: p4,
        buttonText: "Design your Engagement Ring",
        linkText: "View All Engagement Rings",
      },
      {
        title: "Wedding Rings",
        image: p5,
        buttonText: "Personalize your Band",
        linkText: "View All Wedding Rings",
      },
      {
        title: "Daily Wear Rings",
        image: p6,
        buttonText: "Shop Everyday Style",
        linkText: "View All Casual Rings",
      },
    ],
    education: {
      title: "Jewellery Guide",
      items: [
        { label: "Gold Guide", icon: Gem, color: "text-orange-400" },
        { label: "Size Guide", icon: Maximize, color: "text-orange-400" },
        { label: "Care Guide", icon: Info, color: "text-orange-400" },
        { label: "Gifting Guide", icon: Heart, color: "text-orange-400" },
      ]
    }
  },
  { 
    label: "Earrings", 
    category: "earrings",
    subItems: ["Studs", "Hoops", "Drops", "Jhumkas"]
  },
  { 
    label: "Pendants", 
    category: "necklaces",
    subItems: ["Heart", "Religious", "Alphabet", "Diamond"]
  },
  { 
    label: "Solitaires", 
    category: "rings",
    type: "mega",
    columns: [
      {
        title: "Solitaire Rings",
        image: p1,
        buttonText: "Make your own Solitaire Ring",
        linkText: "View All Preset Solitaire Rings",
      },
      {
        title: "Solitaire Pendants",
        image: p2,
        buttonText: "Make your own Solitaire Pendant",
        linkText: "View All Preset Solitaire Pendants",
      },
      {
        title: "Solitaire Earrings",
        image: p3,
        buttonText: "Make your own Solitaire Earring",
        linkText: "View All Preset Solitaire Earrings",
      },
    ],
    education: {
      title: "Diamond Education",
      items: [
        { label: "Cut", icon: Maximize, color: "text-orange-400" },
        { label: "Clarity", icon: Zap, color: "text-orange-400" },
        { label: "Tips & Tricks", icon: Info, color: "text-orange-400" },
        { label: "Colour", icon: Gem, color: "text-orange-400" },
        { label: "Carat", icon: Award, color: "text-orange-400" },
        { label: "Certification", icon: Award, color: "text-orange-400" },
      ]
    }
  },
  { 
    label: "All Jewellery", 
    category: "rings",
    subItems: ["Gold", "Diamond", "Platinum", "Silver"]
  },
];

const NAV_RIGHT = [
  { label: "Gifts", category: "rings", subItems: ["For Her", "For Him", "Under 10k"] },
  { label: "Gold Coins", category: "rings", subItems: ["1 Gram", "2 Gram", "5 Gram"] },
  { label: "Offers", category: "rings", subItems: ["Discount", "Cashback", "Seasonal"] },
];

export function Header() {
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);

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
                  {item.columns.map((col: any) => (
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
                      {item.education.items.map((edu: any) => (
                        <div key={edu.label} className="flex items-center gap-3 group/edu cursor-pointer">
                          <div className={cn("p-2 rounded-full bg-orange-50 transition-colors group-hover/edu:bg-orange-100", edu.color)}>
                            <edu.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 group-hover/edu:text-primary transition-colors">{edu.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              item.subItems.map((sub: string) => (
                <DropdownMenuItem key={sub} asChild>
                  <Link
                    to="/catalog/$category"
                    params={{ category: item.category as any }}
                    className="block px-4 py-2.5 text-[11px] font-medium hover:bg-slate-50 hover:text-primary transition-colors border-b last:border-0 border-slate-100 cursor-pointer"
                  >
                    {sub}
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
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-[72px] gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-primary text-white p-1 rounded-sm">
              <span className="font-serif font-bold text-xl leading-none">GS</span>
            </div>
            <span className="font-serif text-xl md:text-2xl tracking-[0.1em] text-[#1e2d48] font-bold uppercase">
              GAJANAND
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow max-w-[600px] relative">
            <Input 
              type="text" 
              placeholder="Search for jewellery..." 
              className="w-full bg-white border-[#b0b0b0] rounded-[4px] pl-10 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center">
            <ActionItem icon={History} label="Recently viewed" to="/account" />
            <ActionItem icon={Video} label="Video call cart" to="/account" />
            <ActionItem icon={MapPin} label="Find a store" to="/account" />
            <ActionItem icon={Heart} label="Wishlist" to="/account" />
            <ActionItem icon={ShoppingBag} label="Cart" onClick={open} badge={count} />
            <ActionItem icon={User} label="Profile" to="/account" />
            <ActionItem icon={MoreVertical} label="More" />
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#001938] text-white border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between min-h-[44px]">
          <div className="flex items-center gap-4">
            {NAV_LEFT.map((n) => (
              <NavItem key={n.label} item={n} />
            ))}
          </div>
          <div className="flex items-center gap-4">
            {NAV_RIGHT.map((n) => (
              <NavItem key={n.label} item={n} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
