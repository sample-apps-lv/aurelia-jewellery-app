import { 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  Star,
  LucideIcon
} from "lucide-react";

interface Promise {
  title: string;
  desc: string;
  icon: string;
}

interface PromisesSectionProps {
  promises: Promise[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  RefreshCw,
  Truck,
  Star
};

export function PromisesSection({ promises }: PromisesSectionProps) {
  if (promises.length === 0) return null;

  return (
    <section className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {promises.map((promise) => {
            const Icon = ICON_MAP[promise.icon] || Star;
            return (
              <div key={promise.title} className="text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-gold shadow-sm">
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="font-medium text-lg mb-2">{promise.title}</h4>
                <p className="text-sm text-muted-foreground">{promise.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
