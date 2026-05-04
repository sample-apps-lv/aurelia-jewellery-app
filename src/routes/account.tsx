import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts } from "@/features/catalog/api/use-products";
import { useWishlist } from "@/features/wishlist/store/use-wishlist";
import { ProductCard } from "@/features/catalog/components/product-card";
import { Heart, Package, MapPin } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Aurelia" }] }),
  component: AccountPage,
});

const ORDERS = [
  { id: "AUR-78421", date: "Mar 12, 2025", status: "Delivered", total: 489000 },
  { id: "AUR-77103", date: "Jan 28, 2025", status: "Delivered", total: 219000 },
];

function AccountPage() {
  const { data: products = [] } = useProducts();
  const wishIds = useWishlist((s) => s.ids);
  const wishProducts = products.filter((p) => wishIds.includes(p.id));

  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs tracking-luxe text-gold mb-4">Welcome back</p>
        <h1 className="font-serif text-5xl">Your Atelier</h1>
      </div>

      <section className="mb-16">
        <h2 className="font-serif text-2xl flex items-center gap-3 mb-6"><Package className="h-5 w-5 text-gold" /> Order History</h2>
        <div className="border border-border divide-y divide-border">
          {ORDERS.map((o) => (
            <div key={o.id} className="flex justify-between items-center p-5">
              <div>
                <p className="font-medium">{o.id}</p>
                <p className="text-xs text-muted-foreground mt-1">{o.date}</p>
              </div>
              <p className="text-xs tracking-luxe text-gold">{o.status}</p>
              <p className="text-sm">${(o.total / 100).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl flex items-center gap-3 mb-6"><MapPin className="h-5 w-5 text-gold" /> Saved Address</h2>
        <div className="border border-border p-6 max-w-md text-sm space-y-1">
          <p className="font-medium">Eleanor Vance</p>
          <p className="text-muted-foreground">12 rue Saint-Honoré</p>
          <p className="text-muted-foreground">75001 Paris, France</p>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl flex items-center gap-3 mb-6"><Heart className="h-5 w-5 text-gold" /> Wishlist</h2>
        {wishProducts.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            Your wishlist is empty. <Link to="/catalog/$category" params={{ category: "rings" }} className="text-gold border-b border-gold">Discover pieces</Link>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
