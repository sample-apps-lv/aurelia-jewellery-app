import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const CATEGORIES = [
  {
    title: "Layered Necklaces",
    description: "Elevate your style with chic layered necklaces for a trendy look.",
    image: "/src/assets/p1.jpg",
    to: "/catalog/necklaces",
  },
  {
    title: "Coveted Styles",
    description: "A curated selection of Gajanand's most coveted jewels.",
    image: "/src/assets/p2.jpg",
    to: "/catalog/bestsellers",
  },
  {
    title: "Gajanand Man",
    description: "Shop the perfect pieces to enhance your man's unique style.",
    image: "/src/assets/p3.jpg",
    to: "/catalog/men",
  },
];

const GIFT_POINTS = [
  { label: "Under", price: "10k", to: "/catalog/under-10k" },
  { label: "Under", price: "30k", to: "/catalog/under-30k" },
  { label: "Under", price: "50k", to: "/catalog/under-50k" },
];

export function GiftSelectionSection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex gap-8 items-stretch">
          
          {/* Left Side: Categories */}
          <div className="flex w-1/2 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <Link 
                key={idx} 
                to={cat.to as any}
                className="group flex flex-col h-full bg-[#FFF5F7] rounded-[24px] overflow-hidden border border-transparent hover:border-[#FFDADA] transition-all p-4"
              >
                <div className="relative aspect-square w-full mb-6 overflow-hidden rounded-[18px] bg-white flex items-center justify-center p-4">
                  <img 
                    src={cat.image} 
                    alt={cat.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <h3 className="text-[20px] font-serif text-[#1A1A1A] mb-3 relative inline-block w-fit">
                  {cat.title}
                  <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#1A1A1A]"></div>
                </h3>
                <p className="text-[14px] text-[#666666] leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Right Side: Gift Section */}
          <div className="relative w-1/2 bg-[#93709B] rounded-[32px] p-6 md:p-10 flex flex-col items-center justify-center text-center overflow-hidden min-h-[400px] ">
            {/* Decorative Hearts - Scattered */}
            <div className="absolute inset-0 pointer-events-none">
                <Heart className="absolute top-12 left-8 text-[#F4D3D3] fill-[#F4D3D3] opacity-80 w-6 h-6 rotate-[-15deg]" />
                <Heart className="absolute top-32 left-4 text-[#F4D3D3] fill-[#F4D3D3] opacity-40 w-4 h-4 rotate-[10deg]" />
                <Heart className="absolute bottom-24 left-10 text-[#F4D3D3] fill-[#F4D3D3] opacity-60 w-5 h-5 rotate-[20deg]" />
                <Heart className="absolute top-16 right-12 text-[#F4D3D3] fill-[#F4D3D3] opacity-70 w-7 h-7 rotate-[15deg]" />
                <Heart className="absolute bottom-12 right-8 text-[#F4D3D3] fill-[#F4D3D3] opacity-50 w-5 h-5 rotate-[-10deg]" />
                <Heart className="absolute top-1/2 right-6 text-[#F4D3D3] fill-[#F4D3D3] opacity-30 w-4 h-4" />
                <Heart className="absolute top-8 left-1/2 -translate-x-20 text-[#F4D3D3] fill-[#F4D3D3] opacity-40 w-4 h-4" />
                <Heart className="absolute bottom-8 right-1/2 translate-x-20 text-[#F4D3D3] fill-[#F4D3D3] opacity-40 w-4 h-4" />
            </div>

            <div className="relative z-10 w-full h-full border-2 border-dashed border-white/40 rounded-[28px] p-6 md:p-10 flex flex-col items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-serif mb-12 leading-tight max-w-lg">
                Choose the perfect <span className="italic">Gift</span> for your loved ones
              </h2>

              <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl">
                {GIFT_POINTS.map((point, idx) => (
                  <Link 
                    key={idx}
                    to={point.to as any}
                    className="group flex flex-col items-center"
                  >
                    <div className="relative w-full aspect-[4/5] bg-white rounded-[18px] flex flex-col items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500 pt-4">
                      {/* Bow */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 flex justify-center items-end">
                         <div className="w-7 h-7 bg-[#EBB4B4] rounded-full -mr-1 shadow-sm"></div>
                         <div className="w-7 h-7 bg-[#EBB4B4] rounded-full -ml-1 shadow-sm"></div>
                         <div className="absolute top-1 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#EBB4B4] rounded-sm z-10"></div>
                      </div>
                      
                      <span className="text-[12px] md:text-sm text-[#93709B] font-medium mb-1">{point.label}</span>
                      <span className="text-3xl md:text-5xl font-serif text-[#93709B] font-bold">{point.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
