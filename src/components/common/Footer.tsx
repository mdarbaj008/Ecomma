import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Sparkles, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F1B2D] text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F59E0B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">100% Genuine Craft</div>
              <div className="text-[11px] text-slate-400">Direct from verified artisan clusters</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#14B8A6] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">COD Available</div>
              <div className="text-[11px] text-slate-400">Pay cash upon safe delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral-500/10 border border-coral-500/20 flex items-center justify-center text-[#FF6B4A] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">7-Day Easy Returns</div>
              <div className="text-[11px] text-slate-400">Hassle-free replacement guarantee</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Real-Time Tracking</div>
              <div className="text-[11px] text-slate-400">Live courier & AWB timeline</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" inverted={true} />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Ecomma empowers India&apos;s independent weavers, master brass smiths, spice harvesters, and studio potters to list effortlessly, sell nationwide, and deliver with pride.
            </p>
            <div className="flex items-center gap-3 text-xs text-amber-400 font-medium">
              <HeartHandshake className="w-4 h-4" />
              <span>Supporting 600+ traditional craft families across 14 states</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Market
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Handlooms+%26+Sarees" className="hover:text-amber-400 transition-colors">Handlooms & Sarees</Link></li>
              <li><Link to="/products?category=Brass+%26+Bell+Metal" className="hover:text-amber-400 transition-colors">Moradabad Brassware</Link></li>
              <li><Link to="/products?category=Regional+Spices+%26+Teas" className="hover:text-amber-400 transition-colors">Malabar Gourmet Spices</Link></li>
              <li><Link to="/products?category=Kashmiri+Crafts" className="hover:text-amber-400 transition-colors">Kashmiri Woodcraft</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Sellers
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/seller/onboarding" className="hover:text-amber-400 transition-colors">Start Selling on Ecomma</Link></li>
              <li><Link to="/seller" className="hover:text-amber-400 transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/seller/products/new" className="hover:text-amber-400 transition-colors">AI Listing Assistant</Link></li>
              <li><Link to="/seller/earnings" className="hover:text-amber-400 transition-colors">8% Fair Commission & Payouts</Link></li>
              <li><Link to="/seller/orders" className="hover:text-amber-400 transition-colors">Shipping & AWB Manager</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Buyer Support
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/orders" className="hover:text-amber-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-amber-400 transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-amber-400 transition-colors">Manage Delivery Addresses</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors">Marketplace Operations</Link></li>
              <li><a href="#support" onClick={(e) => { e.preventDefault(); alert('Support helpline: 1800-200-COMM (Mon-Sat 9AM-8PM IST)'); }} className="hover:text-amber-400 transition-colors">Artisan Care Helpline</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Ecomma Marketplace Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Shipping & Return Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
