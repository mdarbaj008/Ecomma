import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storage';
import { ProductCard } from '../../components/buyer/ProductCard';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/formatters';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Store,
  Layers,
  ShoppingBag,
  Star,
  CheckCircle2,
  ChevronRight,
  Award,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const categories = StorageService.getCategories();
  const allProducts = StorageService.getProducts();
  const sellers = StorageService.getSellers();
  const { setFilters } = useStore();
  const navigate = useNavigate();

  const trendingProducts = allProducts.filter((p) => p.isTrending || p.isFeatured).slice(0, 8);
  const dealProducts = allProducts.filter((p) => p.discountPercent >= 25).slice(0, 4);

  const handleCategoryClick = (categoryName: string) => {
    setFilters({ category: categoryName });
    navigate('/products');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#FBF7F0] pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Bold Hero Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>India&apos;s Curated Multi-Vendor Craft Marketplace</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1B2D] leading-[1.08] text-balance">
                Authentic Indian Crafts. Direct from Master Hands.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Discover handloom silks, hand-beaten brassware, single-estate spices, and heritage crafts. Connect directly with verified weavers and artisans with Cash on Delivery and pan-India express logistics.
              </p>

              {/* Two Primary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-[#0F1B2D] hover:bg-[#1E293B] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                  <span>Start Shopping</span>
                </Link>

                <Link
                  to="/seller/onboarding"
                  className="px-6 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-[#0F1B2D] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Start Selling</span>
                </Link>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-amber-900/10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>100% Certified GI Crafts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-coral-600" />
                  <span>7-Day Return Policy</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Hero Image Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group">
                <img
                  src="/src/assets/images/ecomma_hero_banner_1790850400315.jpg"
                  alt="Ecomma artisan boutique interior"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Floating Artisan Spotlight Tag */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 text-[#0F1B2D] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/chanderi_silk_saree_1790850427979.jpg"
                      alt="Chanderi Silk"
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-400"
                    />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Featured Craft Cluster
                      </div>
                      <div className="text-xs font-bold truncate">Varanasi & Chanderi Weaves</div>
                      <div className="text-[11px] text-slate-500">140+ Hereditary Weavers</div>
                    </div>
                  </div>

                  <Link
                    to="/products?category=Handlooms+%26+Sarees"
                    className="p-2 rounded-xl bg-[#0F1B2D] text-white hover:bg-[#F59E0B] hover:text-black transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Animated "List -> Sell -> Deliver" 3-Step Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F1B2D] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Step 1: List */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:pr-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#F59E0B] flex items-center justify-center font-editorial font-bold text-xl shrink-0">
                01
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>List with AI in 60s</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Snap 1-5 photos, type a few rough words. Gemini auto-generates SEO titles, rich craft stories, and competitive pricing.
                </p>
              </div>
            </div>

            {/* Step 2: Sell */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#14B8A6] flex items-center justify-center font-editorial font-bold text-xl shrink-0">
                02
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Sell with 8% Fair Cut</span>
                  <Award className="w-3.5 h-3.5 text-[#14B8A6]" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reach verified buyers nationwide. Transparent 8% commission, zero listing charges, and automated instant payouts.
                </p>
              </div>
            </div>

            {/* Step 3: Deliver */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-4">
              <div className="w-12 h-12 rounded-2xl bg-coral-500/10 border border-coral-500/20 text-[#FF6B4A] flex items-center justify-center font-editorial font-bold text-xl shrink-0">
                03
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Doorstep Courier & COD</span>
                  <Truck className="w-3.5 h-3.5 text-[#FF6B4A]" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  One-click courier pickup, automated AWB generation, live tracking timeline, and safe Cash on Delivery collection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Tiles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-1">
              Curated Craft Traditions
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
              Explore Regional Artisanal Clusters
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#0F1B2D] hover:text-[#F59E0B] flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group text-left bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F1B2D] group-hover:text-amber-800 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Trending Handcrafted Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold text-coral-600 uppercase tracking-wider mb-1">
              Handpicked Creations
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
              Trending in Indian Homes
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#0F1B2D] hover:text-[#F59E0B] flex items-center gap-1 transition-colors"
          >
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Top Artisan Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              The Masters Behind The Craft
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
              Meet Our Top Verified Sellers
            </h2>
          </div>
          <Link
            to="/seller/onboarding"
            className="text-xs font-semibold text-[#F59E0B] hover:underline"
          >
            Join as an Artisan Seller ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellers.slice(0, 3).map((seller) => (
            <div
              key={seller.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={seller.logo}
                  alt={seller.storeName}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-[#0F1B2D] truncate">{seller.storeName}</h3>
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500">{seller.city}, {seller.state}</div>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{seller.rating}</span>
                    <span className="text-slate-400 font-normal">({seller.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {seller.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Orders Fulfilled: <strong>{seller.totalOrders}</strong></span>
                <button
                  onClick={() => {
                    setFilters({ sellerId: seller.id });
                    navigate('/products');
                  }}
                  className="text-amber-800 font-semibold hover:underline"
                >
                  View Store ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Special Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-black rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-black/15 text-black font-extrabold text-[11px] tracking-wider uppercase">
              Festive Seasonal Offer
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1B2D]">
              Direct From The Weavers & Smiths: Save up to 35%
            </h2>
            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
              Enjoy limited-run discounts on genuine pure Chanderi silk sarees, Moradabad brass cookware, and Kashmiri saffron boxes.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="px-6 py-3 rounded-xl bg-[#0F1B2D] hover:bg-black text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition-all"
              >
                <span>Shop Festive Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block" />
        </div>
      </section>

      {/* 7. Seller CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
            Are You an Indian Artisan or Producer?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Take your craft to discerning buyers across India. Enjoy fast AI listing, fair 8% commission, zero listing fees, and door-to-door courier logistics.
          </p>
          <div className="pt-3">
            <Link
              to="/seller/onboarding"
              className="px-8 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-[#0F1B2D] font-bold text-xs inline-flex items-center gap-2 shadow-md transition-all"
            >
              <span>Apply for Verified Seller Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
