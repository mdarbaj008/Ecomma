import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import { ProductCard } from '../../components/buyer/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useStore();
  const allProducts = StorageService.getProducts();

  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
          My Saved Wishlist ({wishlistedProducts.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Handpicked craft favorites saved for festivals and gifting.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-editorial text-xl font-bold text-slate-900">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-slate-500">
            Click the heart icon on any handcrafted piece to save it for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
