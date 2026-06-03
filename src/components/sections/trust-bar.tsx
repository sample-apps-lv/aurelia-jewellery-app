import { Video, MapPin, Smartphone, ShieldCheck } from "lucide-react";

export function TrustBar() {
  return (
    <section className="bg-secondary/30 py-4 hidden md:block">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-gold" />
            <span>Free Video Call</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold" />
            <span>Find a Store</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-gold" />
            <span>Try at Home</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>The BlueStone Promise</span>
          </div>
        </div>
      </div>
    </section>
  );
}
