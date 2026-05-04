import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, ShieldCheck, Award, Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-noir text-cream mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-5">
            <h3 className="font-serif text-3xl">Join the House</h3>
            <p className="text-sm text-cream/70 max-w-md leading-relaxed">
              Receive private previews, atelier stories, and an invitation to our seasonal collections.
            </p>
            <form className="flex max-w-md border-b border-cream/30 focus-within:border-gold">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent flex-1 py-3 text-sm placeholder:text-cream/50 focus:outline-none"
              />
              <button className="text-xs tracking-luxe text-gold hover:text-gold-light">
                Subscribe
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-xs tracking-luxe text-gold mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li><Link to="/" className="hover:text-gold">Shipping</Link></li>
              <li><Link to="/" className="hover:text-gold">Returns</Link></li>
              <li><Link to="/" className="hover:text-gold">Ring Size Guide</Link></li>
              <li><Link to="/" className="hover:text-gold">Care Instructions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-luxe text-gold mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li>Atelier Aurelia</li>
              <li>Place Vendôme, Paris</li>
              <li>concierge@aurelia.co</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="hover:text-gold"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gold"><Facebook className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-gold"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row gap-6 items-center justify-between">
          <p className="text-xs text-cream/50">© {new Date().getFullYear()} Aurelia Fine Jewelry. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-cream/60">
            <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-gold" /> Secure Checkout</span>
            <span className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-gold" /> Certified Materials</span>
            <span className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-gold" /> Insured Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
