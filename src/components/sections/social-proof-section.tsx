import { Badge } from "@/components/ui/badge";
import heroVideoFallback from "@/assets/hero.webm";

interface SocialProofSectionProps {
  videoUrl?: string;
}

export function SocialProofSection({ videoUrl }: SocialProofSectionProps) {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">#GajanandJewellersAndMe</h2>
          <p className="text-muted-foreground">Share your sparkle on Instagram</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-square bg-muted relative group overflow-hidden">
              <img 
                src={videoUrl || heroVideoFallback} 
                alt="Social Post" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                <Badge variant="secondary" className="bg-white text-black">Shop the Look</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
