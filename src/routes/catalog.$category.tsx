import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@/features/catalog/api/use-products";
import { ProductCard } from "@/features/catalog/components/product-card";
import type { Category, Material, Gemstone } from "@/types/product";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/catalog/$category")({
  head: ({ params }) => ({
    meta: [
      { title: `${cap(params.category)} — Aurelia` },
      { name: "description", content: `Shop our ${params.category} collection — handcrafted in fine gold and ethically sourced gemstones.` },
    ],
  }),
  component: CatalogPage,
});

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const MATERIALS: Material[] = ["Gold", "Silver", "Platinum", "Rose Gold"];
const GEMSTONES: Gemstone[] = ["Diamond", "Ruby", "Emerald", "Sapphire"];

function CatalogPage() {
  const { category } = useParams({ from: "/catalog/$category" }) as { category: Category };
  const { data: all = [] } = useProducts();
  const [materials, setMaterials] = useState<string[]>([]);
  const [gemstones, setGemstones] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 10000]);
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let out = all.filter((p) => category === "bridal" ? p.occasion === "Bridal" : p.category === category);
    if (materials.length) out = out.filter((p) => materials.includes(p.material));
    if (gemstones.length) out = out.filter((p) => gemstones.includes(p.gemstone));
    out = out.filter((p) => p.price / 100 >= price[0] && p.price / 100 <= price[1]);
    if (sort === "low") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "high") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "best") out = [...out].sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller));
    return out;
  }, [all, category, materials, gemstones, price, sort]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <p className="text-xs tracking-luxe text-gold mb-4">Collection</p>
        <h1 className="font-serif text-5xl md:text-6xl">{cap(category)}</h1>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Hand-finished pieces, certified materials, made to be worn for a lifetime.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-12">
        <aside className="space-y-10">
          <div>
            <h3 className="text-xs tracking-luxe mb-4 text-gold">Material</h3>
            <div className="space-y-3">
              {MATERIALS.map((m) => (
                <label key={m} className="flex items-center gap-3 text-sm cursor-pointer">
                  <Checkbox checked={materials.includes(m)} onCheckedChange={() => toggle(materials, setMaterials, m)} />
                  {m}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs tracking-luxe mb-4 text-gold">Gemstone</h3>
            <div className="space-y-3">
              {GEMSTONES.map((g) => (
                <label key={g} className="flex items-center gap-3 text-sm cursor-pointer">
                  <Checkbox checked={gemstones.includes(g)} onCheckedChange={() => toggle(gemstones, setGemstones, g)} />
                  {g}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs tracking-luxe mb-4 text-gold">Price</h3>
            <Slider min={0} max={10000} step={100} value={price} onValueChange={(v) => setPrice(v as [number, number])} />
            <div className="flex justify-between text-xs text-muted-foreground mt-3">
              <span>${price[0].toLocaleString()}</span>
              <span>${price[1].toLocaleString()}+</span>
            </div>
          </div>
        </aside>

        <div>
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-muted-foreground">{filtered.length} pieces</p>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[200px] border-0 border-b border-border rounded-none focus:ring-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="best">Bestselling</SelectItem>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No pieces match your selection.</p>
              <Link to="/catalog/$category" params={{ category: "rings" }} className="mt-4 inline-block text-gold border-b border-gold pb-1 text-xs tracking-luxe">Reset</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
