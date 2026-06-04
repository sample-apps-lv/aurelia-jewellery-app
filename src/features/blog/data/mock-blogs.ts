import { BlogPost } from "../types/blog";

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "1",
    slug: "choosing-perfect-engagement-ring",
    title: "How to Choose the Perfect Engagement Ring",
    excerpt: "Everything you need to know about selecting the diamond, the setting, and the metal for a proposal they'll never forget.",
    content: `
      <h2>The Ultimate Guide to Engagement Rings</h2>
      <p>Choosing an engagement ring is one of the most significant purchases you'll ever make. It's not just about the diamond; it's about finding a piece that reflects your partner's style and your shared future.</p>
      <h3>Understand the 4Cs</h3>
      <p>Before you start shopping, familiarize yourself with Cut, Color, Clarity, and Carat. The cut is perhaps the most important, as it determines how much the diamond sparkles.</p>
      <h3>Selecting the Right Metal</h3>
      <p>While platinum is popular for its durability, yellow gold is making a huge comeback for its classic, warm feel. Rose gold offers a romantic, vintage alternative.</p>
      <h3>Know Their Style</h3>
      <p>Does your partner prefer minimalist designs or something more ornate like a halo setting? Pay attention to the jewelry they already wear.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1584302174827-511018a47284?q=80&w=1200&auto=format&fit=crop",
    author: "Aditi Sharma",
    date: "May 15, 2026",
    category: "Guides",
    readTime: "5 min read",
    tags: ["Engagement", "Diamonds", "Buying Guide"],
  },
  {
    id: "2",
    slug: "caring-for-your-gold-jewelry",
    title: "5 Tips for Caring for Your Gold Jewelry",
    excerpt: "Keep your gold pieces shining like new with these simple at-home cleaning and maintenance tips.",
    content: `
      <h2>Preserving the Luster of Your Gold</h2>
      <p>Gold jewelry is meant to last a lifetime, but it requires proper care to maintain its brilliance. Daily wear can lead to a buildup of oils and dirt.</p>
      <h3>1. Avoid Harsh Chemicals</h3>
      <p>Remove your jewelry before swimming in chlorinated pools or using household cleaning products. Chemicals can discolor gold and damage delicate settings.</p>
      <h3>2. Gentle Cleaning at Home</h3>
      <p>Mix a few drops of mild dish soap with warm water. Soak your jewelry for 15-20 minutes, then gently scrub with a soft-bristled toothbrush.</p>
      <h3>3. Store Properly</h3>
      <p>Keep your pieces in separate compartments or soft pouches to prevent scratching. Gold is a relatively soft metal and can easily be marked by harder gemstones.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1611085516823-7cb4420800df?q=80&w=1200&auto=format&fit=crop",
    author: "Rajesh Mehra",
    date: "May 20, 2026",
    category: "Maintenance",
    readTime: "3 min read",
    tags: ["Gold", "Care", "Jewelry Tips"],
  },
  {
    id: "3",
    slug: "jewelry-trends-summer-2026",
    title: "Jewelry Trends to Watch This Summer 2026",
    excerpt: "From bold statement necklaces to delicate layered chains, here's what's trending in the world of fine jewelry this season.",
    content: `
      <h2>Summer 2026: Bold and Beautiful</h2>
      <p>This summer is all about making a statement. We're seeing a move away from ultra-minimalism towards pieces that tell a story and catch the eye.</p>
      <h3>Layering is Still King</h3>
      <p>Layering multiple necklaces of varying lengths remains a favorite. Mix textures like pearls with gold chains for a modern twist.</p>
      <h3>Sustainable Luxury</h3>
      <p>Ethically sourced gemstones and recycled gold are no longer just a niche—they're a primary consideration for the modern jewelry lover.</p>
      <h3>Vibrant Gemstones</h3>
      <p>Bright, saturated colors like emerald green, sapphire blue, and even neon-hued spinels are lighting up summer collections.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
    author: "Priya Das",
    date: "June 1, 2026",
    category: "Trends",
    readTime: "4 min read",
    tags: ["Trends", "Summer", "Fashion"],
  }
];
