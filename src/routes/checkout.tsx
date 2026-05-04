import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/features/cart/store/use-cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Aurelia" }] }),
  component: CheckoutPage,
});

const STEPS = ["Shipping", "Delivery", "Payment", "Confirmation"];

function CheckoutPage() {
  const [step, setStep] = useState(0);
  const { items, subtotal, clear } = useCart();
  const total = subtotal();

  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">Checkout</h1>
      <div className="flex items-center justify-center gap-2 md:gap-6 mb-12 flex-wrap">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-[10px]",
              i <= step ? "bg-noir text-cream" : "bg-secondary text-muted-foreground",
            )}>{i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}</div>
            <span className={cn("text-xs tracking-luxe", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < STEPS.length - 1 && <span className="hidden md:inline-block w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {step === 0 && (
            <>
              <h2 className="font-serif text-2xl mb-6">Shipping Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First Name" />
                <Input label="Last Name" />
                <Input label="Email" type="email" className="sm:col-span-2" />
                <Input label="Address" className="sm:col-span-2" />
                <Input label="City" />
                <Input label="Postal Code" />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-serif text-2xl mb-6">Delivery Method</h2>
              {[
                { name: "Standard Delivery", time: "5-7 business days", price: "Complimentary" },
                { name: "Express Delivery", time: "2-3 business days", price: "$25" },
                { name: "Atelier Pickup", time: "Place Vendôme, Paris", price: "Complimentary" },
              ].map((opt, i) => (
                <label key={i} className="flex items-center justify-between border border-border p-5 cursor-pointer hover:border-gold">
                  <div className="flex gap-4 items-start">
                    <input type="radio" name="delivery" defaultChecked={i === 0} className="mt-1 accent-foreground" />
                    <div>
                      <p className="font-medium">{opt.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{opt.time}</p>
                    </div>
                  </div>
                  <span className="text-sm">{opt.price}</span>
                </label>
              ))}
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-serif text-2xl mb-6">Payment</h2>
              <div className="grid gap-4">
                <Input label="Card Number" placeholder="•••• •••• •••• ••••" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Expiry" placeholder="MM / YY" />
                  <Input label="CVC" />
                </div>
                <Input label="Name on Card" />
              </div>
            </>
          )}
          {step === 3 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-gold mx-auto flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-noir" />
              </div>
              <h2 className="font-serif text-3xl mb-3">Thank you</h2>
              <p className="text-muted-foreground mb-2">Your order has been received.</p>
              <p className="text-xs tracking-luxe text-gold mb-8">Order #AUR-{Math.floor(Math.random() * 90000 + 10000)}</p>
              <Link to="/" onClick={() => clear()} className="text-xs tracking-luxe border-b border-foreground pb-1 hover:text-gold hover:border-gold">
                Return Home
              </Link>
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between pt-6">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="text-xs tracking-luxe hover:text-gold">← Back</button>
              ) : <span />}
              <button onClick={() => setStep(step + 1)} className="bg-noir text-cream px-8 py-4 text-xs tracking-luxe hover:bg-foreground">
                Continue
              </button>
            </div>
          )}
        </motion.div>

        <aside className="bg-secondary p-8 h-fit">
          <h3 className="font-serif text-xl mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
            {items.length === 0 && <p className="text-sm text-muted-foreground">Your bag is empty.</p>}
            {items.map((i) => (
              <div key={i.productId + i.size} className="flex gap-3">
                <img src={i.image} alt="" className="w-14 h-16 object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-serif">{i.title}</p>
                  <p className="text-xs text-muted-foreground">Qty {i.quantity}{i.size && ` · ${i.size}`}</p>
                </div>
                <p className="text-sm">{formatPrice(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4 border-t border-border text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Complimentary</span></div>
            <div className="flex justify-between font-medium pt-3 border-t border-border mt-3 text-base">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({ label, className, ...rest }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="text-[10px] tracking-luxe text-muted-foreground block mb-2">{label}</label>
      <input {...rest} className="w-full border-b border-border focus:border-gold bg-transparent py-3 text-sm focus:outline-none transition" />
    </div>
  );
}
