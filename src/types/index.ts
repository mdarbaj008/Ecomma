export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  type: 'home' | 'work' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  sellerId?: string;
  addresses: Address[];
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  logo: string;
  banner?: string;
  description: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  kycStatus: 'approved' | 'pending' | 'rejected';
  commissionRate: number; // e.g. 0.08 for 8%
  bankDetails: {
    upiId: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  pickupAddress: Address;
  gstNumber?: string;
  walletBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalOrders: number;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number;
  images: string[];
  codAvailable: boolean;
  rating: number;
  reviewCount: number;
  features: string[];
  tags: string[];
  attributes: Record<string, string>;
  variants?: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  seoScore?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  status: 'active' | 'inactive' | 'draft' | 'flagged';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  selectedAttributes?: Record<string, string>;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface ShipmentEvent {
  timestamp: string;
  status: string;
  description: string;
  location: string;
}

export interface SubOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variantName?: string;
}

export interface SubOrder {
  id: string;
  orderId: string;
  sellerId: string;
  sellerName: string;
  items: SubOrderItem[];
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  commission: number;
  sellerPayout: number;
  courierName: string;
  awbNumber: string;
  estimatedDelivery: string;
  trackingEvents: ShipmentEvent[];
  isCodCollected?: boolean;
  labelGenerated?: boolean;
  pickupScheduled?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: Address;
  paymentMethod: 'ONLINE' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  paymentId?: string;
  totalAmount: number;
  subtotal: number;
  shippingTotal: number;
  codFee: number;
  discount: number;
  couponCode?: string;
  itemsCount: number;
  subOrders: SubOrder[];
  createdAt: string;
  status: OrderStatus;
}

export interface Payout {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  referenceNumber?: string;
  bankInfo: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
}

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  sellerId: string | null;
  codOnly: boolean;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}
