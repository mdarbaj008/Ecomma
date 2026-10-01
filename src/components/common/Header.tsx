import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import { GeminiService } from '../../services/geminiClient';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Store,
  Package,
  ShieldAlert,
  LogOut,
  MapPin,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { cart, wishlist, currentUser, setFilters, addToast, switchRole } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = StorageService.getCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsCategoryOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    // Check if query looks conversational / natural language (e.g. contains under, below, for, cod, cheap, best)
    const isNatural = /under|below|above|between|cod|saree|brass|best|cheap|tea|organic/i.test(searchInput);

    if (isNatural) {
      setIsSearchingAi(true);
      try {
        const catNames = categories.map((c) => c.name);
        const parsed = await GeminiService.parseSearchQuery(searchInput, catNames);
        setFilters({
          searchQuery: parsed.searchTerm || searchInput,
          category: parsed.category,
          maxPrice: parsed.maxPrice || 20000,
          minPrice: parsed.minPrice || 0,
          codOnly: parsed.codOnly,
          sortBy: parsed.sortBy as any || 'featured',
        });
        addToast({
          title: 'AI Smart Filter applied',
          message: `Query parsed: ${parsed.searchTerm || 'Filtered'}${parsed.maxPrice ? ` under ₹${parsed.maxPrice}` : ''}${parsed.codOnly ? ' (COD only)' : ''}`,
          type: 'info',
        });
      } catch (err) {
        setFilters({ searchQuery: searchInput });
      } finally {
        setIsSearchingAi(false);
        navigate('/products');
      }
    } else {
      setFilters({ searchQuery: searchInput });
      navigate('/products');
    }
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FBF7F0]/95 backdrop-blur-md border-b border-amber-900/10 shadow-[0_2px_15px_rgba(15,27,45,0.03)]">
      {/* Main Bar: Strictly 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-700 hover:text-black lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo size="md" />
        </div>

        {/* Zone 2: Search with AI parsing & Navigation Links */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products or type naturally e.g. 'silk saree under 5000'..."
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm pl-11 pr-24 py-2.5 rounded-xl border border-slate-200/80 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:border-[#F59E0B] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

              <button
                type="submit"
                disabled={isSearchingAi}
                className="absolute right-1.5 px-3 py-1.5 bg-[#0F1B2D] hover:bg-[#1E293B] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {isSearchingAi ? (
                  <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                )}
                <span>AI Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Zone 3: Actions (Categories, Wishlist, Cart, User, Sell CTA) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Categories Popover */}
          <div className="relative hidden md:block" ref={categoryMenuRef}>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-black flex items-center gap-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Explore Crafts</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in duration-200">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">
                  Artisanal Clusters
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFilters({ category: cat.name });
                        navigate('/products');
                        setIsCategoryOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-amber-50/60 transition-colors flex items-center gap-3 group"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-9 h-9 rounded-lg object-cover ring-1 ring-black/5"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-amber-900 truncate">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cat.productCount} artisanal listings
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-xl transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FBF7F0]">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-black/5 rounded-xl transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] text-black text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FBF7F0]">
                {cartTotalCount}
              </span>
            )}
          </Link>

          {/* Account Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs font-medium text-slate-800 shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <span className="hidden sm:inline font-semibold">{currentUser.name.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="font-semibold text-xs text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs text-slate-700">
                  <Link
                    to="/orders"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-slate-500" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span>Profile & Addresses</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <Link
                      to="/seller"
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-950 font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Store className="w-4 h-4 text-amber-600" />
                        <span>Seller Portal</span>
                      </div>
                      <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">Dashboard</span>
                    </Link>

                    <Link
                      to="/admin"
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-teal-600" />
                        <span>Admin Console</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Admin</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <Link
                      to="/login"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-slate-400" />
                      <span>Switch Account</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* "Start Selling" CTA Button */}
          <Link
            to="/seller/onboarding"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-[#0F1B2D] font-semibold text-xs tracking-tight shadow-sm hover:shadow transition-all"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Start Selling</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar & Navigation */}
      <div className="lg:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products or ask in natural Hindi/English..."
            className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-[#0F1B2D] text-white text-[11px] font-medium rounded-lg flex items-center gap-1"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#F59E0B]" />
            AI Search
          </button>
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
            Explore Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilters({ category: cat.name });
                  navigate('/products');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left p-2 rounded-lg bg-amber-50/50 hover:bg-amber-100/60 text-xs font-medium text-slate-800 truncate"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs font-medium">
            <Link to="/products" className="py-1.5 text-slate-700">All Products</Link>
            <Link to="/orders" className="py-1.5 text-slate-700">My Orders & Tracking</Link>
            <Link to="/seller" className="py-1.5 text-amber-800 font-semibold">Seller Dashboard</Link>
            <Link to="/admin" className="py-1.5 text-slate-800 font-semibold">Admin Panel</Link>
            <Link to="/seller/onboarding" className="py-2 text-center bg-[#F59E0B] text-black rounded-lg font-semibold mt-2">
              Become a Verified Seller
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
