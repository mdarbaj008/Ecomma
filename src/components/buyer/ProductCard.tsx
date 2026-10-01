import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../store/useStore';
import { Heart, ShoppingBag, Star, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(15,27,45,0.08)] transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-stone-100/70 overflow-hidden">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {/* Sticker-style badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-[#0F1B2D] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
              New Arrival
            </span>
          )}
          {product.codAvailable && (
            <span className="px-2 py-0.5 rounded-md bg-[#14B8A6] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
              COD Available
            </span>
          )}
          {product.rating >= 4.9 && (
            <span className="px-2 py-0.5 rounded-md bg-[#F59E0B] text-black text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
              Top Rated
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
        </button>

        {/* Out of Stock Ribbon if zero */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed Metadata: Category & Seller */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
          <span className="uppercase tracking-wider font-semibold text-amber-800/80 truncate">
            {product.category}
          </span>
          <div className="flex items-center gap-1 font-semibold text-slate-700 tabular-nums shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          className="font-semibold text-sm text-[#0F1B2D] hover:text-[#F59E0B] transition-colors line-clamp-2 leading-snug mb-2"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Seller Info */}
        <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-3">
          <span>By</span>
          <span className="font-medium text-slate-700 truncate">{product.sellerName}</span>
          <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
        </div>

        {/* Price & Buy Button Footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base text-[#0F1B2D] tabular-nums tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discountPercent > 0 && (
              <span className="text-[10px] font-semibold text-emerald-600">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              product.stock > 0
                ? 'bg-[#0F1B2D] hover:bg-[#F59E0B] text-white hover:text-black shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Add to Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
