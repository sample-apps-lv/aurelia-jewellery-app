import { Video, MapPin, Smartphone, ShieldCheck, Shield, Award, Truck, Clock, RefreshCw, Star, Heart, Gem, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Video,
  MapPin,
  Smartphone,
  ShieldCheck,
  Shield,
  Award,
  Truck,
  Clock,
  RefreshCw,
  Star,
  Heart,
  Gem,
  Sparkles,
};

interface TrustItem {
  icon: string;
  label: string;
}

interface TrustBarProps {
  items?: TrustItem[];
}

const DEFAULT_ITEMS: TrustItem[] = [
  { icon: "Video", label: "Free Video Call" },
  { icon: "MapPin", label: "Find a Store" },
  { icon: "Smartphone", label: "Try at Home" },
  { icon: "ShieldCheck", label: "The Gajanand Promise" },
];

export function TrustBar({ items }: TrustBarProps) {
  const trustItems = items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <section className="bg-secondary/30 py-4">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
        <div className="flex justify-between items-center text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-max md:min-w-0 gap-8 md:gap-0">
          {trustItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || ShieldCheck;
            return (
              <div key={item.label} className="flex items-center gap-2">
                <Icon className="w-3 h-3 md:w-4 md:h-4 text-gold" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
