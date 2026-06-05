import { Video, MapPin, Smartphone, ShieldCheck } from "lucide-react";

export function TrustBar() {
  return (
    <section className="bg-secondary/30 py-4">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
        <div className="flex justify-between items-center text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-max md:min-w-0 gap-8 md:gap-0">
          <div className="flex items-center gap-2">
            <Video className="w-3 h-3 md:w-4 md:h-4 text-gold" />
            <span>Free Video Call</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gold" />
            <span>Find a Store</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-3 h-3 md:w-4 md:h-4 text-gold" />
            <span>Try at Home</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-gold" />
            <span>The BlueStone Promise</span>
          </div>
        </div>
      </div>
    </section>
  );
}
