import {
  User,
  SellerProfile,
  Product,
  Category,
  Order,
  SubOrder,
  OrderStatus,
  Review,
  Coupon,
  Payout,
  Address,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_SELLERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
} from '../data/mockData';
import { generateAwb } from '../utils/formatters';

const KEYS = {
  USERS: 'ecomma_users_v1',
  CURRENT_USER: 'ecomma_current_user_v1',
  CATEGORIES: 'ecomma_categories_v1',
  SELLERS: 'ecomma_sellers_v1',
  PRODUCTS: 'ecomma_products_v1',
  ORDERS: 'ecomma_orders_v1',
  REVIEWS: 'ecomma_reviews_v1',
  COUPONS: 'ecomma_coupons_v1',
  PAYOUTS: 'ecomma_payouts_v1',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage setItem failed:', err);
  }
}

export const StorageService = {
  init() {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      setItem(KEYS.USERS, INITIAL_USERS);
      setItem(KEYS.CURRENT_USER, INITIAL_USERS[0]); // Default to Buyer Priya
      setItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
      setItem(KEYS.SELLERS, INITIAL_SELLERS);
      setItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
      setItem(KEYS.ORDERS, INITIAL_ORDERS);
      setItem(KEYS.REVIEWS, INITIAL_REVIEWS);
      setItem(KEYS.COUPONS, INITIAL_COUPONS);
      setItem(KEYS.PAYOUTS, [
        {
          id: 'pay_1',
          sellerId: 'seller_1',
          sellerName: 'Varanasi Weavers Guild',
          amount: 45000,
          status: 'processed',
          requestedAt: '2024-09-01T10:00:00Z',
          processedAt: '2024-09-02T16:00:00Z',
          referenceNumber: 'HDFC-NEFT-99182371',
          bankInfo: 'HDFC Bank Chowk Varanasi (Acct ...1122)',
        },
      ]);
    }
  },

  resetDefaults() {
    localStorage.clear();
    this.init();
    window.location.reload();
  },

  // USERS & AUTH
  getUsers(): User[] {
    return getItem(KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User {
    return getItem(KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  setCurrentUser(user: User): void {
    setItem(KEYS.CURRENT_USER, user);
  },

  updateUser(id: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      setItem(KEYS.USERS, users);
      const curr = this.getCurrentUser();
      if (curr.id === id) {
        setItem(KEYS.CURRENT_USER, users[idx]);
      }
      return users[idx];
    }
    return this.getCurrentUser();
  },

  addAddress(userId: string, address: Omit<Address, 'id'>): Address {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    };
    if (user) {
      if (address.isDefault) {
        user.addresses = user.addresses.map((a) => ({ ...a, isDefault: false }));
      }
      user.addresses.push(newAddress);
      setItem(KEYS.USERS, users);
      const curr = this.getCurrentUser();
      if (curr.id === userId) {
        setItem(KEYS.CURRENT_USER, user);
      }
    }
    return newAddress;
  },

  // SELLERS
  getSellers(): SellerProfile[] {
    return getItem(KEYS.SELLERS, INITIAL_SELLERS);
  },

  getSellerById(id: string): SellerProfile | undefined {
    return this.getSellers().find((s) => s.id === id);
  },

  updateSeller(id: string, updates: Partial<SellerProfile>): SellerProfile | undefined {
    const sellers = this.getSellers();
    const idx = sellers.findIndex((s) => s.id === id);
    if (idx !== -1) {
      sellers[idx] = { ...sellers[idx], ...updates };
      setItem(KEYS.SELLERS, sellers);
      return sellers[idx];
    }
    return undefined;
  },

  registerSeller(sellerData: Partial<SellerProfile>, user: User): SellerProfile {
    const sellers = this.getSellers();
    const sellerId = `seller_${Date.now()}`;
    const newSeller: SellerProfile = {
      id: sellerId,
      userId: user.id,
      storeName: sellerData.storeName || 'Artisan Workshop',
      slug: (sellerData.storeName || 'artisan').toLowerCase().replace(/\s+/g, '-'),
      logo: sellerData.logo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80',
      description: sellerData.description || 'Authentic regional artisan craft collective.',
      city: sellerData.city || 'Jaipur',
      state: sellerData.state || 'Rajasthan',
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
      kycStatus: 'pending',
      commissionRate: 0.08,
      bankDetails: sellerData.bankDetails || {
        upiId: 'artisan@upi',
        accountNumber: '1122334455',
        ifsc: 'SBIN0001234',
        bankName: 'State Bank of India',
      },
      pickupAddress: sellerData.pickupAddress || {
        id: `pick_${Date.now()}`,
        name: sellerData.storeName || 'Store Dispatch',
        phone: user.phone || '+91 99000 00000',
        addressLine1: 'Craft Center, Main Market',
        city: sellerData.city || 'Jaipur',
        state: sellerData.state || 'Rajasthan',
        pincode: '302001',
        type: 'work',
      },
      gstNumber: sellerData.gstNumber,
      walletBalance: 0,
      pendingBalance: 0,
      totalEarnings: 0,
      totalOrders: 0,
      createdAt: new Date().toISOString(),
    };

    sellers.push(newSeller);
    setItem(KEYS.SELLERS, sellers);

    // Update user to have role seller and sellerId
    this.updateUser(user.id, { role: 'seller', sellerId });

    return newSeller;
  },

  // PRODUCTS
  getProducts(): Product[] {
    return getItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },

  addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    setItem(KEYS.PRODUCTS, products);

    // Update category product count
    const categories = this.getCategories();
    const cat = categories.find((c) => c.name === newProduct.category || c.id === newProduct.categoryId);
    if (cat) {
      cat.productCount += 1;
      setItem(KEYS.CATEGORIES, categories);
    }

    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      setItem(KEYS.PRODUCTS, products);
      return products[idx];
    }
    return undefined;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length !== products.length) {
      setItem(KEYS.PRODUCTS, filtered);
      return true;
    }
    return false;
  },

  // CATEGORIES
  getCategories(): Category[] {
    return getItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // COUPONS
  getCoupons(): Coupon[] {
    return getItem(KEYS.COUPONS, INITIAL_COUPONS);
  },

  applyCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code.' };
    }
    if (subtotal < coupon.minOrderValue) {
      return { valid: false, discount: 0, message: `Minimum order value ₹${coupon.minOrderValue} required for this coupon.` };
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
    return { valid: true, discount, message: `Coupon ${coupon.code} applied! Saved ₹${discount}.` };
  },

  // ORDERS & MULTI-VENDOR SPLITTING
  getOrders(): Order[] {
    return getItem(KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  },

  createOrder(orderData: {
    buyer: User;
    shippingAddress: Address;
    paymentMethod: 'ONLINE' | 'COD';
    paymentId?: string;
    items: { product: Product; quantity: number; variantName?: string }[];
    discount?: number;
    couponCode?: string;
  }): Order {
    const orders = this.getOrders();
    const orderId = `ord_${Math.floor(1000 + Math.random() * 9000)}`;

    // Group items by seller
    const sellerGroups = new Map<string, typeof orderData.items>();
    for (const item of orderData.items) {
      const sId = item.product.sellerId;
      if (!sellerGroups.has(sId)) {
        sellerGroups.set(sId, []);
      }
      sellerGroups.get(sId)!.push(item);
    }

    const subOrders: SubOrder[] = [];
    let subtotalTotal = 0;
    const codFee = orderData.paymentMethod === 'COD' ? 50 : 0;

    sellerGroups.forEach((items, sellerId) => {
      const seller = this.getSellerById(sellerId);
      const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      subtotalTotal += subtotal;

      const commissionRate = seller?.commissionRate || 0.08;
      const commission = Math.round(subtotal * commissionRate * 100) / 100;
      const sellerPayout = subtotal - commission;

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
      const estDelStr = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(estimatedDelivery);

      const subOrder: SubOrder = {
        id: `sub_${orderId}_${sellerId.replace('seller_', '')}`,
        orderId,
        sellerId,
        sellerName: seller?.storeName || 'Verified Artisan Seller',
        items: items.map((i) => ({
          productId: i.product.id,
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0],
          variantName: i.variantName,
        })),
        status: 'placed',
        subtotal,
        shippingFee: 0,
        commission,
        sellerPayout,
        courierName: 'Delhivery Surface',
        awbNumber: generateAwb(),
        estimatedDelivery: estDelStr,
        labelGenerated: false,
        pickupScheduled: false,
        isCodCollected: false,
        createdAt: new Date().toISOString(),
        trackingEvents: [
          {
            timestamp: new Intl.DateTimeFormat('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date()),
            status: 'Order Placed',
            description: `Order successfully placed by ${orderData.buyer.name}`,
            location: orderData.shippingAddress.city,
          },
        ],
      };

      subOrders.push(subOrder);

      // Deduct inventory
      for (const item of items) {
        const prod = this.getProductById(item.product.id);
        if (prod) {
          this.updateProduct(prod.id, {
            stock: Math.max(0, prod.stock - item.quantity),
          });
        }
      }
    });

    const discount = orderData.discount || 0;
    const totalAmount = Math.max(0, subtotalTotal + codFee - discount);

    const newOrder: Order = {
      id: orderId,
      buyerId: orderData.buyer.id,
      buyerName: orderData.buyer.name,
      buyerEmail: orderData.buyer.email,
      buyerPhone: orderData.shippingAddress.phone,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
      paymentId: orderData.paymentId || (orderData.paymentMethod === 'ONLINE' ? `pay_mock_${Date.now()}` : undefined),
      totalAmount,
      subtotal: subtotalTotal,
      shippingTotal: 0,
      codFee,
      discount,
      couponCode: orderData.couponCode,
      itemsCount: orderData.items.reduce((s, i) => s + i.quantity, 0),
      subOrders,
      status: 'placed',
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    setItem(KEYS.ORDERS, orders);

    return newOrder;
  },

  updateSubOrderStatus(subOrderId: string, nextStatus: OrderStatus, customMessage?: string): SubOrder | undefined {
    const orders = this.getOrders();
    for (const order of orders) {
      const sub = order.subOrders.find((s) => s.id === subOrderId);
      if (sub) {
        sub.status = nextStatus;

        let statusText = 'Status Updated';
        let desc = customMessage || `Order moved to ${nextStatus}`;

        if (nextStatus === 'packed') {
          statusText = 'Packed & Ready for Dispatch';
          desc = desc || 'Seller packed the item in tamper-proof bubble mailer.';
          sub.labelGenerated = true;
        } else if (nextStatus === 'shipped') {
          statusText = 'Handed Over to Courier';
          desc = desc || `Package picked up by ${sub.courierName}. AWB: ${sub.awbNumber}`;
          sub.pickupScheduled = true;
        } else if (nextStatus === 'out_for_delivery') {
          statusText = 'Out for Delivery';
          desc = desc || 'Courier partner out for delivery to buyer address.';
        } else if (nextStatus === 'delivered') {
          statusText = 'Delivered';
          desc = desc || 'Package delivered successfully to recipient.';
          if (order.paymentMethod === 'COD') {
            sub.isCodCollected = true;
            order.paymentStatus = 'PAID';
          }
          // Credit seller wallet
          const seller = this.getSellerById(sub.sellerId);
          if (seller) {
            this.updateSeller(seller.id, {
              walletBalance: seller.walletBalance + sub.sellerPayout,
              totalEarnings: seller.totalEarnings + sub.sellerPayout,
              totalOrders: seller.totalOrders + 1,
            });
          }
        }

        sub.trackingEvents.push({
          timestamp: new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date()),
          status: statusText,
          description: desc,
          location: nextStatus === 'delivered' || nextStatus === 'out_for_delivery' ? order.shippingAddress.city : `${sub.sellerName} Hub`,
        });

        // Sync parent order overall status
        const allDelivered = order.subOrders.every((s) => s.status === 'delivered');
        const anyShipped = order.subOrders.some((s) => s.status === 'shipped' || s.status === 'out_for_delivery');
        if (allDelivered) {
          order.status = 'delivered';
        } else if (anyShipped) {
          order.status = 'shipped';
        }

        setItem(KEYS.ORDERS, orders);
        return sub;
      }
    }
    return undefined;
  },

  // Fast forward workflow demo button
  fastForwardSubOrder(subOrderId: string): SubOrder | undefined {
    const orders = this.getOrders();
    for (const order of orders) {
      const sub = order.subOrders.find((s) => s.id === subOrderId);
      if (sub) {
        const flow: OrderStatus[] = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
        const currentIdx = flow.indexOf(sub.status);
        if (currentIdx !== -1 && currentIdx < flow.length - 1) {
          const next = flow[currentIdx + 1];
          return this.updateSubOrderStatus(subOrderId, next);
        }
      }
    }
    return undefined;
  },

  // PAYOUTS
  getPayouts(): Payout[] {
    return getItem(KEYS.PAYOUTS, []);
  },

  requestPayout(sellerId: string, amount: number): { success: boolean; message: string; payout?: Payout } {
    const seller = this.getSellerById(sellerId);
    if (!seller) return { success: false, message: 'Seller not found.' };
    if (amount <= 0 || amount > seller.walletBalance) {
      return { success: false, message: `Requested amount exceeds available balance of ₹${seller.walletBalance}.` };
    }

    const payouts = this.getPayouts();
    const newPayout: Payout = {
      id: `payout_${Date.now()}`,
      sellerId: seller.id,
      sellerName: seller.storeName,
      amount,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      bankInfo: `${seller.bankDetails.bankName} (UPI: ${seller.bankDetails.upiId})`,
    };

    payouts.unshift(newPayout);
    setItem(KEYS.PAYOUTS, payouts);

    // Deduct available, add to pending
    this.updateSeller(sellerId, {
      walletBalance: seller.walletBalance - amount,
      pendingBalance: seller.pendingBalance + amount,
    });

    return { success: true, message: `Payout request of ₹${amount} submitted successfully!`, payout: newPayout };
  },

  approvePayout(payoutId: string): boolean {
    const payouts = this.getPayouts();
    const p = payouts.find((item) => item.id === payoutId);
    if (p && p.status === 'pending') {
      p.status = 'processed';
      p.processedAt = new Date().toISOString();
      p.referenceNumber = `NEFT-IMPS-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const seller = this.getSellerById(p.sellerId);
      if (seller) {
        this.updateSeller(seller.id, {
          pendingBalance: Math.max(0, seller.pendingBalance - p.amount),
        });
      }

      setItem(KEYS.PAYOUTS, payouts);
      return true;
    }
    return false;
  },

  // REVIEWS
  getReviews(productId?: string): Review[] {
    const all = getItem(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return all.filter((r) => r.productId === productId);
    }
    return all;
  },

  addReview(reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };
    reviews.unshift(newReview);
    setItem(KEYS.REVIEWS, reviews);

    // Update product rating
    const prod = this.getProductById(reviewData.productId);
    if (prod) {
      const prodReviews = reviews.filter((r) => r.productId === prod.id);
      const avg = prodReviews.reduce((s, r) => s + r.rating, 0) / prodReviews.length;
      this.updateProduct(prod.id, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: prodReviews.length,
      });
    }

    return newReview;
  },
};

// Initialize on module load
StorageService.init();
