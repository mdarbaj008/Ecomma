import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storage';
import { Product, ProductVariant } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../store/useStore';
import { PincodeChecker } from '../../components/buyer/PincodeChecker';
import { AskAiWidget } from '../../components/buyer/AskAiWidget';
import { ProductCard } from '../../components/buyer/ProductCard';
import { GeminiService } from '../../services/geminiClient';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  ArrowRight,
  Share2,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, addToast } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [aiReviewSummary, setAiReviewSummary] = useState<{ overallVerdict: string; pros: string[]; cons: string[] } | null>(null);
  const [isSummarizingReviews, setIsSummarizingReviews] = useState(false);

  useEffect(() => {
    if (id) {
      const p = StorageService.getProductById(id);
      if (p) {
        setProduct(p);
        setSelectedImage(p.images[0]);
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }
      }
    }
    window.scrollTo(0, 0);
  }, [id]);

  // Load Gemini Review summary
  useEffect(() => {
    if (product) {
      const reviews = StorageService.getReviews(product.id);
      if (reviews.length > 0) {
        setIsSummarizingReviews(true);
        GeminiService.getReviewSummary(product.title, reviews)
          .then((sum) => setAiReviewSummary(sum))
          .catch(() => {})
          .finally(() => setIsSummarizingReviews(false));
      }
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">The artisanal piece you are looking for is no longer available.</p>
        <Link to="/products" className="inline-block px-4 py-2 bg-[#0F1B2D] text-white text-xs font-semibold rounded-xl">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const seller = StorageService.getSellerById(product.sellerId);
  const relatedProducts = StorageService.getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant?.id);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant?.id);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-900">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Contiguous Purchase Grid (Sticky Gallery Left, Sticky Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4 sticky top-24">
          {/* Main Showcase Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 bg-stone-100 shadow-md">
            <img
              src={selectedImage || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#F59E0B] ring-2 ring-amber-400/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Ask AI Widget Grounded in Product Data */}
          <div className="pt-4">
            <AskAiWidget product={product} />
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title & Seller Badges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-bold text-amber-800">
                {product.category}
              </span>
              <div className="flex items-center gap-1 font-bold text-slate-800 tabular-nums">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D] leading-tight">
              {product.title}
            </h1>

            {/* Seller Card Row */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Crafted & Dispatched by <strong className="text-slate-900 font-semibold">{product.sellerName}</strong></span>
              </div>
              <span className="text-[11px] text-amber-900 font-semibold">{seller?.city || 'Varanasi'}, {seller?.state || 'UP'}</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-3xl text-[#0F1B2D] tabular-nums font-editorial">
                {formatCurrency(displayPrice)}
              </span>
              {displayOriginalPrice > displayPrice && (
                <span className="text-base text-slate-400 line-through tabular-nums">
                  {formatCurrency(displayOriginalPrice)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              Inclusive of all taxes · Free standard delivery on orders above ₹499
            </div>
          </div>

          {/* Variant Selector (if available) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Choose Option / Variant:</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#0F1B2D] bg-[#0F1B2D] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {v.name} · {formatCurrency(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Buy CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-stone-50 border-2 border-[#0F1B2D] text-[#0F1B2D] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0F1B2D] hover:bg-[#1E293B] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <div className="text-[11px] text-coral-600 text-red-600 font-semibold">
                Only {product.stock} pieces remaining in this artisan batch!
              </div>
            )}
          </div>

          {/* Pincode Serviceability & COD Checker */}
          <div className="pt-2">
            <PincodeChecker />
          </div>

          {/* Description & Key Features */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <h3 className="font-editorial text-base font-bold text-slate-900 mb-2">
                Craft Heritage & Story
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Key Specifications
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.attributes && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Artisan Provenance
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  {Object.entries(product.attributes).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-400">{k}: </span>
                      <strong className="text-slate-800 font-semibold">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Review Summary & Customer Reviews */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#0F1B2D]">
              Customer Experiences & Reviews
            </h2>
            <p className="text-xs text-slate-500">Real feedback from verified patrons across India</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-editorial text-slate-900 tabular-nums">
              {product.rating} / 5.0
            </div>
            <div className="text-[11px] text-slate-400">Based on {product.reviewCount} ratings</div>
          </div>
        </div>

        {/* Gemini AI Review Synthesis */}
        {aiReviewSummary && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Gemini AI Review Highlights</span>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              &quot;{aiReviewSummary.overallVerdict}&quot;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-teal-800 uppercase">Top Strengths:</span>
                {aiReviewSummary.pros.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-teal-950">
                    <span className="text-teal-600 font-bold">+</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase">Good to Know:</span>
                {aiReviewSummary.cons.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-700">
                    <span className="text-slate-400 font-bold">·</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Individual Reviews */}
        <div className="space-y-4 pt-2">
          {StorageService.getReviews(product.id).map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{rev.buyerName}</span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-teal-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
                <span className="text-slate-400 text-[11px]">{rev.date}</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <h2 className="font-editorial text-2xl font-bold text-[#0F1B2D]">
            More From {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
