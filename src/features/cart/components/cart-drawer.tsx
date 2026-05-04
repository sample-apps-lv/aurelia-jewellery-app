import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "../store/use-cart";
import { formatPrice } from "@/lib/format";
import { useEffect } from "react";

export function CartDrawer() {
  const { isOpen, close, items, removeItem, updateQty, subtotal } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-noir/60 backdrop-blur-sm z-50"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-serif text-2xl">Your Bag</h2>
              <button onClick={close} aria-label="Close" className="hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Your bag is empty.</p>
                <Link to="/catalog/rings" onClick={close} className="text-xs tracking-luxe text-gold border-b border-gold pb-1">
                  Discover the Collection
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-5">
                      <img src={item.image} alt={item.title} className="w-20 h-24 object-cover bg-secondary" />
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-serif text-base leading-tight">{item.title}</h3>
                            {item.size && <p className="text-xs text-muted-foreground mt-1">Size {item.size}</p>}
                          </div>
                          <button onClick={() => removeItem(item.productId, item.size)} aria-label="Remove">
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                        <div className="mt-auto flex justify-between items-end">
                          <div className="flex items-center border border-border">
                            <button onClick={() => updateQty(item.productId, item.quantity - 1, item.size)} className="p-2 hover:text-gold">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button onClick={() => updateQty(item.productId, item.quantity + 1, item.size)} className="p-2 hover:text-gold">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border px-6 py-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal())}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    onClick={close}
                    className="block w-full text-center bg-noir text-cream py-4 text-xs tracking-luxe hover:bg-foreground transition"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
