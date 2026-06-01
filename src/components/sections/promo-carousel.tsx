import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import hero from "@/assets/hero.jpg"; // Placeholder
import catBridal from "@/assets/cat-bridal.jpg"; // Placeholder
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROMOS = [
  {
    id: 1,
    image: hero,
    title: "Old is the new gold?",
    subtitle: "BIG GOLD UPGRADE",
    cta: "TRY NOW",
    bgColor: "bg-gradient-to-r from-[#e5e7eb] to-[#1e3a8a]"
  },
  {
    id: 2,
    image: catBridal,
    title: "Vows in Light",
    subtitle: "THE BRIDAL COLLECTION",
    cta: "EXPLORE",
    bgColor: "bg-gradient-to-r from-[#fdf2f8] to-[#9d174d]"
  },
  {
    id: 3,
    image: hero,
    title: "New Arrivals",
    subtitle: "SEASONAL PICKS",
    cta: "SHOP NOW",
    bgColor: "bg-gradient-to-r from-[#fef3c7] to-[#d97706]"
  },
  {
    id: 4,
    image: catBridal,
    title: "Diamond Offers",
    subtitle: "SPARKLE MORE",
    cta: "VIEW ALL",
    bgColor: "bg-gradient-to-r from-[#ecfeff] to-[#0891b2]"
  }
];

import { 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

export function PromoCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-8 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto relative group">
        <Carousel 
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{ loop: true }} 
          className="w-full"
        >
          <CarouselContent>
            {PROMOS.map((promo) => (
              <CarouselItem key={promo.id}>
                <div className={`relative h-[300px] md:h-[450px] w-full overflow-hidden rounded-xl ${promo.bgColor}`}>
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-10 md:px-20 text-white">
                    <div className="max-w-md">
                      <h3 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">
                        {promo.title}
                      </h3>
                    </div>
                    <div className="text-right flex flex-col items-end gap-6">
                      <div className="border-2 border-white border-dashed rounded-full px-8 py-8 flex flex-col items-center justify-center">
                        <span className="text-xs tracking-[0.3em] font-bold">BIG</span>
                        <span className="text-2xl font-black tracking-tighter">GOLD</span>
                        <span className="text-sm font-bold tracking-widest leading-none">UPGRADE</span>
                      </div>
                      <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none px-8 py-6 uppercase tracking-widest font-bold text-xs">
                        {promo.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom Navigation Buttons */}
          <button 
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={() => api?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </Carousel>

        {/* Custom Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 bg-white/50 hover:bg-white",
                current === i ? "w-8 bg-white" : "w-2"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
