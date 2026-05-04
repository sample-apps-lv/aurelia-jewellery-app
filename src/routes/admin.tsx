import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/features/catalog/api/use-products";
import { formatPrice } from "@/lib/format";
import { Package, DollarSign, ShoppingCart, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aurelia" }] }),
  component: AdminPage,
});

const RECENT_ORDERS = [
  { id: "AUR-78421", customer: "E. Vance", date: "Mar 12", total: 489000, status: "Delivered" },
  { id: "AUR-78420", customer: "M. Laurent", date: "Mar 11", total: 219000, status: "Shipped" },
  { id: "AUR-78419", customer: "S. Romano", date: "Mar 10", total: 689000, status: "Processing" },
  { id: "AUR-78418", customer: "J. Park", date: "Mar 09", total: 129000, status: "Delivered" },
];

function AdminPage() {
  const { data: products = [] } = useProducts();
  const totalSales = RECENT_ORDERS.reduce((s, o) => s + o.total, 0);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-luxe text-gold mb-2">Atelier Admin</p>
          <h1 className="font-serif text-4xl">Dashboard</h1>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Stat icon={DollarSign} label="Total Sales" value={formatPrice(totalSales)} />
        <Stat icon={ShoppingCart} label="Orders" value={String(RECENT_ORDERS.length)} />
        <Stat icon={Package} label="Products" value={String(products.length)} />
        <Stat icon={Users} label="Customers" value="248" />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="font-serif text-2xl mb-6">Recent Orders</h2>
          <div className="border border-border">
            <div className="grid grid-cols-4 px-4 py-3 text-[10px] tracking-luxe text-muted-foreground border-b border-border">
              <span>Order</span><span>Customer</span><span>Status</span><span className="text-right">Total</span>
            </div>
            {RECENT_ORDERS.map((o) => (
              <div key={o.id} className="grid grid-cols-4 px-4 py-4 text-sm border-b border-border last:border-b-0">
                <span className="font-medium">{o.id}</span>
                <span>{o.customer}</span>
                <span className="text-xs text-gold tracking-luxe">{o.status}</span>
                <span className="text-right">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl">Inventory</h2>
            <button className="text-xs tracking-luxe bg-noir text-cream px-4 py-2 hover:bg-foreground">+ Add Product</button>
          </div>
          <div className="border border-border divide-y divide-border">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <img src={p.images[0]} alt="" className="w-12 h-14 object-cover bg-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(p.price)} · Stock {p.stock}</p>
                </div>
                <button className="text-xs tracking-luxe text-muted-foreground hover:text-gold">Edit</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="border border-border p-5">
      <Icon className="h-4 w-4 text-gold mb-3" />
      <p className="text-xs tracking-luxe text-muted-foreground">{label}</p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}
