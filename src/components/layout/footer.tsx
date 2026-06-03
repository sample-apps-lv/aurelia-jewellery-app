import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube, ShieldCheck, RefreshCw, Truck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#f9f9f9] text-foreground mt-24 border-t">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          <div className="col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Know Our Story</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-gold">About Us</Link></li>
              <li><Link to="/" className="hover:text-gold">Our Blog</Link></li>
              <li><Link to="/" className="hover:text-gold">Press Coverage</Link></li>
              <li><Link to="/" className="hover:text-gold">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Customer Care</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-gold">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-gold">Track Order</Link></li>
              <li><Link to="/" className="hover:text-gold">Free Try at Home</Link></li>
              <li><Link to="/" className="hover:text-gold">Return Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Jewellery Guide</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-gold">Gold Guide</Link></li>
              <li><Link to="/" className="hover:text-gold">Diamond Guide</Link></li>
              <li><Link to="/" className="hover:text-gold">Jewellery Care</Link></li>
              <li><Link to="/" className="hover:text-gold">Ring Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-gold">Terms & Conditions</Link></li>
              <li><Link to="/fraud-warning" className="hover:text-gold">Fraud Warning</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates on new collections and special offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-white border flex-1 px-4 py-2 text-sm focus:outline-none focus:border-gold"
              />
              <button className="bg-primary text-white px-6 py-2 text-sm font-bold hover:bg-primary/90 transition-colors">
                SUBMIT
              </button>
            </form>
            <div className="flex gap-6 mt-8">
              <a href="#" className="text-muted-foreground hover:text-gold"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-gold"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-gold"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-gold"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <span>100% Certified</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter">
              <RefreshCw className="h-5 w-5 text-gold" />
              <span>Lifetime Exchange</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter">
              <Truck className="h-5 w-5 text-gold" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter">
              <Heart className="h-5 w-5 text-gold" />
              <span>30-Day Returns</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gajanand Jewellers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
