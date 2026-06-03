import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import heroVideoFallback from "@/assets/hero.webm";

interface HeroSectionProps {
  hero?: {
    videoUrl: string;
    badge: string;
    heading: string;
    subheading: string;
    ctaPrimaryLink: string;
    ctaPrimaryText: string;
  };
}

export function HeroSection({ hero }: HeroSectionProps) {

  console.log({"223hero": hero})
  return (
    <section className="relative h-[400px] md:h-[700px] w-full overflow-hidden">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        key={hero?.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={hero?.videoUrl || heroVideoFallback} type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-black/30" />
      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      <div className="absolute inset-0 flex items-center px-6 lg:px-20">
        <div className="max-w-xl text-white">
          <Badge className="mb-4 bg-gold text-white hover:bg-gold-light border-none rounded-none px-4 py-1 text-[10px] font-bold tracking-widest">
            {hero?.badge || "EXCLUSIVE COLLECTION"}
          </Badge>
          <h2 className="text-4xl md:text-7xl font-serif mb-6 leading-tight">
            {hero?.heading?.split(" ")[0]} <br /> <span className="text-gold-light italic">{hero?.heading?.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-lg mb-8 text-white/90 hidden md:block font-light tracking-wide max-w-md">
            {hero?.subheading}
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="cursor-pointer bg-gold hover:bg-gold-light text-white border-none rounded-none px-10 py-6 text-xs uppercase tracking-widest font-bold shadow-lg">
              <Link to={hero?.ctaPrimaryLink as any || "/catalog/rings"}>{hero?.ctaPrimaryText || "Explore Collection"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
