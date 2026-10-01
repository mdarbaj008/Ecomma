import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { ProductCard } from '../../components/buyer/ProductCard';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/formatters';
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Star,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const { filters, setFilters, resetFilters } = useStore();
  const allProducts = StorageService.getProducts();
  const categories = StorageService.getCategories();
  const sellers = StorageService.getSellers();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.sellerName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category
      if (filters.category && p.category !== filters.category) {
        return false;
      }

      // Price Range
      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }

      // Rating
      if (filters.rating && p.rating < filters.rating) {
        return false;
      }

      // Seller
      if (filters.sellerId && p.sellerId !== filters.sellerId) {
        return false;
      }

      // COD Only
      if (filters.codOnly && !p.codAvailable) {
        return false;
      }

      // In Stock Only
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // default 'featured'
    });
  }, [allProducts, filters]);

  const activeFiltersCount = [
    filters.category !== null,
    filters.maxPrice < 20000 || filters.minPrice > 0,
    filters.rating !== null,
    filters.sellerId !== null,
    filters.codOnly,
    filters.inStockOnly,
    Boolean(filters.searchQuery),
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
            {filters.category ? filters.category : 'All Artisanal Creations'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-900 font-semibold">{filteredProducts.length}</strong> verified authentic handcrafted products
            {filters.searchQuery && <span> matching &quot;{filters.searchQuery}&quot;</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value as any })}
              className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-medium"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Grid / List Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Filter Catalog</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">Categories</div>
            <div className="space-y-1">
              <button
                onClick={() => setFilters({ category: null })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  filters.category === null
                    ? 'bg-amber-100/70 text-amber-950 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span>{allProducts.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters({ category: cat.name })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    filters.category === cat.name
                      ? 'bg-amber-100/70 text-amber-950 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-slate-400">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Max Price</span>
              <span className="text-teal-800 tabular-nums">{formatCurrency(filters.maxPrice)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={20000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
              className="w-full accent-[#F59E0B]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹500</span>
              <span>₹10,000</span>
              <span>₹20,000</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700">Minimum Rating</div>
            <div className="space-y-1">
              {[4.9, 4.8, 4.7, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilters({ rating: filters.rating === r ? null : r })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                    filters.rating === r
                      ? 'bg-amber-100/70 text-amber-950 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{r} & above</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flags: COD & In Stock */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.codOnly}
                onChange={(e) => setFilters({ codOnly: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-[#F59E0B]"
              />
              <span className="text-slate-700 font-medium">Cash on Delivery (COD) Only</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters({ inStockOnly: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-[#F59E0B]"
              />
              <span className="text-slate-700 font-medium">Exclude Out of Stock</span>
            </label>
          </div>

          {/* Seller Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700">Artisan Guild / Store</div>
            <select
              value={filters.sellerId || ''}
              onChange={(e) => setFilters({ sellerId: e.target.value || null })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800"
            >
              <option value="">All Verified Sellers</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>{s.storeName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-slate-900">
                No matching artisanal goods found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your price range, clearing specific filters, or searching for broader terms like &quot;silk&quot; or &quot;brass&quot;.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row gap-4 items-center"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full sm:w-40 aspect-[4/3] rounded-xl object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="text-[11px] uppercase tracking-wider text-amber-800 font-bold">
                      {p.category} · {p.sellerName}
                    </div>
                    <h3 className="font-bold text-base text-[#0F1B2D]">{p.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-lg font-bold text-slate-900 tabular-nums">
                        {formatCurrency(p.price)}
                      </span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          {formatCurrency(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-sm text-[#0F1B2D]">Filter Products</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Categories</div>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilters({ category: c.name })}
                  className="w-full text-left py-1 text-xs text-slate-600 truncate"
                >
                  {c.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
