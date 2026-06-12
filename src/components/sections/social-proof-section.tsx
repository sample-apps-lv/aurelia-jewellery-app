import { Badge } from "@/components/ui/badge";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";

interface SocialProofData {
  heading: string;
  subheading: string;
  images: string[];
}

interface SocialProofSectionProps {
  videoUrl?: string;
  socialProof?: SocialProofData;
}

const DEFAULT_IMAGES = [p1, p2, p3, p4, p5];

const DEFAULT_SOCIAL_PROOF: SocialProofData = {
  heading: "#GajanandJewellers",
  subheading: "Share your sparkle on Instagram",
  images: [],
};

export function SocialProofSection({ videoUrl, socialProof }: SocialProofSectionProps) {
  const data = socialProof || DEFAULT_SOCIAL_PROOF;
  const images = data.images && data.images.length > 0 ? data.images : DEFAULT_IMAGES;

  return (
    <section className="py-12 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">{data.heading}</h2>
          <p className="text-muted-foreground">{data.subheading}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <div key={i} className="aspect-square bg-muted relative group overflow-hidden">
              <img 
                src={img} 
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
