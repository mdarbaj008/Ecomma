import { create } from 'zustand';
import { User, UserRole, CartItem, Product, Coupon, FilterState } from '../types';
import { StorageService } from '../services/storage';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

const DEFAULT_FILTERS: FilterState = {
  category: null,
  minPrice: 0,
  maxPrice: 20000,
  rating: null,
  sellerId: null,
  codOnly: false,
  inStockOnly: false,
  sortBy: 'featured',
  searchQuery: '',
};

interface AppStore {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  savedForLater: CartItem[];
  saveForLater: (productId: string, variantId?: string) => void;
  moveToCartFromSaved: (productId: string, variantId?: string) => void;

  // Coupon
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCouponCode: (code: string, subtotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Filter & Search
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Dark Mode for dashboards
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const CART_STORAGE_KEY = 'ecomma_cart_v1';
const SAVED_STORAGE_KEY = 'ecomma_saved_for_later_v1';
const WISHLIST_STORAGE_KEY = 'ecomma_wishlist_v1';
const DARK_MODE_STORAGE_KEY = 'ecomma_dark_mode_v1';

export const useStore = create<AppStore>((set, get) => {
  const initialUser = StorageService.getCurrentUser();
  const savedCart: CartItem[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  })();
  const savedLater: CartItem[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  })();
  const savedWishlist: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '["prod_1", "prod_3"]');
    } catch {
      return ['prod_1', 'prod_3'];
    }
  })();
  const initialDark = localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';

  return {
    currentUser: initialUser,
    setCurrentUser: (user) => {
      StorageService.setCurrentUser(user);
      set({ currentUser: user });
    },
    switchRole: (role) => {
      const users = StorageService.getUsers();
      const targetUser = users.find((u) => u.role === role);
      if (targetUser) {
        StorageService.setCurrentUser(targetUser);
        set({ currentUser: targetUser });
        get().addToast({
          title: `Switched to ${role.toUpperCase()} mode`,
          message: `Logged in as ${targetUser.name}`,
          type: 'info',
        });
      }
    },

    cart: savedCart,
    addToCart: (product, quantity = 1, variantId) => {
      const { cart, addToast } = get();
      const existingIdx = cart.findIndex(
        (i) => i.productId === product.id && i.variantId === variantId
      );

      let newCart: CartItem[];
      if (existingIdx !== -1) {
        newCart = [...cart];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity,
        };
      } else {
        newCart = [...cart, { productId: product.id, product, quantity, variantId }];
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      set({ cart: newCart });
      addToast({
        title: 'Added to shopping bag',
        message: `${product.title.slice(0, 32)}...`,
        type: 'success',
      });
    },

    updateCartQuantity: (productId, quantity, variantId) => {
      const { cart } = get();
      let newCart: CartItem[];
      if (quantity <= 0) {
        newCart = cart.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        );
      } else {
        newCart = cart.map((i) => {
          if (i.productId === productId && i.variantId === variantId) {
            return { ...i, quantity };
          }
          return i;
        });
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      set({ cart: newCart });
    },

    removeFromCart: (productId, variantId) => {
      const { cart, addToast } = get();
      const item = cart.find(
        (i) => i.productId === productId && i.variantId === variantId
      );
      const newCart = cart.filter(
        (i) => !(i.productId === productId && i.variantId === variantId)
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      set({ cart: newCart });
      if (item) {
        addToast({
          title: 'Removed from bag',
          message: item.product.title.slice(0, 28),
          type: 'info',
        });
      }
    },

    clearCart: () => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      set({ cart: [], appliedCoupon: null, couponDiscount: 0 });
    },

    savedForLater: savedLater,
    saveForLater: (productId, variantId) => {
      const { cart, savedForLater, addToast } = get();
      const item = cart.find(
        (i) => i.productId === productId && i.variantId === variantId
      );
      if (!item) return;

      const newCart = cart.filter(
        (i) => !(i.productId === productId && i.variantId === variantId)
      );
      const newSaved = [...savedForLater, item];

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(newSaved));
      set({ cart: newCart, savedForLater: newSaved });
      addToast({
        title: 'Saved for later',
        message: item.product.title.slice(0, 28),
        type: 'info',
      });
    },

    moveToCartFromSaved: (productId, variantId) => {
      const { savedForLater, cart, addToast } = get();
      const item = savedForLater.find(
        (i) => i.productId === productId && i.variantId === variantId
      );
      if (!item) return;

      const newSaved = savedForLater.filter(
        (i) => !(i.productId === productId && i.variantId === variantId)
      );
      const newCart = [...cart, item];

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(newSaved));
      set({ cart: newCart, savedForLater: newSaved });
      addToast({
        title: 'Moved back to shopping bag',
        message: item.product.title.slice(0, 28),
        type: 'success',
      });
    },

    appliedCoupon: null,
    couponDiscount: 0,
    applyCouponCode: (code, subtotal) => {
      const res = StorageService.applyCoupon(code, subtotal);
      if (res.valid) {
        const coupon = StorageService.getCoupons().find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase()
        );
        set({ appliedCoupon: coupon || null, couponDiscount: res.discount });
        get().addToast({ title: 'Coupon Applied!', message: res.message, type: 'success' });
        return { success: true, message: res.message };
      }
      get().addToast({ title: 'Coupon Failed', message: res.message, type: 'error' });
      return { success: false, message: res.message };
    },
    removeCoupon: () => {
      set({ appliedCoupon: null, couponDiscount: 0 });
      get().addToast({ title: 'Coupon removed', type: 'info' });
    },

    wishlist: savedWishlist,
    toggleWishlist: (productId) => {
      const { wishlist, addToast } = get();
      const exists = wishlist.includes(productId);
      const newWishlist = exists
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId];
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
      set({ wishlist: newWishlist });
      addToast({
        title: exists ? 'Removed from wishlist' : 'Saved to wishlist',
        type: exists ? 'info' : 'success',
      });
    },
    isInWishlist: (productId) => get().wishlist.includes(productId),

    filters: DEFAULT_FILTERS,
    setFilters: (updates) => {
      set((state) => ({
        filters: { ...state.filters, ...updates },
      }));
    },
    resetFilters: () => {
      set({ filters: DEFAULT_FILTERS });
    },

    toasts: [],
    addToast: ({ title, message, type = 'info' }) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      set((state) => ({
        toasts: [...state.toasts, { id, title, message, type }],
      }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },
    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },

    darkMode: initialDark,
    toggleDarkMode: () => {
      const next = !get().darkMode;
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set({ darkMode: next });
    },
  };
});
