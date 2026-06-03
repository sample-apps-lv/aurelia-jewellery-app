import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export const DEFAULT_NAV_LEFT = [
  { 
    label: "10+1 Monthly Plans", 
    category: "rings",
    subItems: [
      { label: "Gold Plans", url: "/plans/gold" },
      { label: "Silver Plans", url: "/plans/silver" },
    ]
  },
  { 
    label: "Watch Jewellery", 
    category: "earrings",
    subItems: [
      { label: "Men's Watches", url: "/catalog/earrings" },
      { label: "Women's Watches", url: "/catalog/earrings" },
      { label: "Smart Watch Straps", url: "/catalog/earrings" }
    ]
  },
  { 
    label: "Rings", 
    category: "rings",
    type: "mega" as const,
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
        { label: "Gold Guide", icon: "Gem", color: "text-orange-400" },
        { label: "Size Guide", icon: "Maximize", color: "text-orange-400" },
        { label: "Care Guide", icon: "Info", color: "text-orange-400" },
        { label: "Gifting Guide", icon: "Heart", color: "text-orange-400" },
      ]
    }
  },
  { 
    label: "Earrings", 
    category: "earrings",
    subItems: [
      { label: "Studs", url: "/catalog/earrings" },
      { label: "Hoops", url: "/catalog/earrings" },
      { label: "Drops", url: "/catalog/earrings" },
      { label: "Jhumkas", url: "/catalog/earrings" }
    ]
  },
  { 
    label: "Pendants", 
    category: "necklaces",
    subItems: [
      { label: "Heart", url: "/catalog/necklaces" },
      { label: "Religious", url: "/catalog/necklaces" },
      { label: "Alphabet", url: "/catalog/necklaces" },
      { label: "Diamond", url: "/catalog/necklaces" }
    ]
  },
  { 
    label: "Solitaires", 
    category: "rings",
    type: "mega" as const,
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
        { label: "Cut", icon: "Maximize", color: "text-orange-400" },
        { label: "Clarity", icon: "Zap", color: "text-orange-400" },
        { label: "Tips & Tricks", icon: "Info", color: "text-orange-400" },
        { label: "Colour", icon: "Gem", color: "text-orange-400" },
        { label: "Carat", icon: "Award", color: "text-orange-400" },
        { label: "Certification", icon: "Award", color: "text-orange-400" },
      ]
    }
  },
  { 
    label: "All Jewellery", 
    category: "rings",
    subItems: [
      { label: "Gold", url: "/catalog/rings" },
      { label: "Diamond", url: "/catalog/rings" },
      { label: "Platinum", url: "/catalog/rings" },
      { label: "Silver", url: "/catalog/rings" }
    ]
  },
];

export const DEFAULT_NAV_RIGHT = [
  { label: "Gifts", category: "rings", subItems: [
    { label: "For Her", url: "/catalog/rings" },
    { label: "For Him", url: "/catalog/rings" },
    { label: "Under 10k", url: "/catalog/rings" }
  ] },
  { label: "Gold Coins", category: "rings", subItems: [
    { label: "1 Gram", url: "/catalog/rings" },
    { label: "2 Gram", url: "/catalog/rings" },
    { label: "5 Gram", url: "/catalog/rings" }
  ] },
  { label: "Offers", category: "rings", subItems: [
    { label: "Discount", url: "/catalog/rings" },
    { label: "Cashback", url: "/catalog/rings" },
    { label: "Seasonal", url: "/catalog/rings" }
  ] },
];

export const DEFAULT_HEADER_CONFIG = {
  logoText: "GAJANAND",
  searchPlaceholder: "Search for jewellery...",
  findStoreLabel: "Find a store",
  wishlistLabel: "Wishlist",
  cartLabel: "Cart",
  profileLabel: "Profile",
  moreLabel: "More",
};
