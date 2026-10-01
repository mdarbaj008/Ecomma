# Ecomma — "List. Sell. Deliver."
### Multi-Vendor Artisanal E-Commerce Marketplace

Ecomma is an editorial multi-vendor marketplace connecting verified Indian weavers, brass smiths, spice harvesters, and studio ceramists with patrons nationwide.

---

## 🚀 Key Features

### 🛍️ Public / Buyer
- **Home & Taxonomy:** Mega-menu exploration across 8 craft clusters (Handlooms, Brassware, Malabar Spices, Kashmiri Crafts, Ayurvedic Wellness, Blue Pottery, Leather, Traditional Jewelry).
- **AI Natural Language Search:** Type conversational queries like *"emerald silk saree under 5000 with COD"* — parsed by Gemini into structured catalog filters.
- **Contiguous Purchase PDP:** Image gallery with zoom, variant picker, pincode delivery & COD serviceability estimator, and real-time **Ask AI About This Product** chat widget.
- **Multi-Vendor Cart & Checkout:** Cart items split into sub-orders per artisan. Prepaid Online (instant simulated UPI / Card) and Cash on Delivery (+₹50 COD fee).
- **Post-Purchase:** Confetti confirmation, downloadable tax invoice, and visual delivery timeline with live AWB tracking.

### 🏪 Seller Dashboard (`/seller`)
- **AI Listing Assistant (Hero Feature):** Upload photos + rough keywords $\to$ Gemini generates SEO-optimized title, description, bullet points, tags, price range, and an SEO score with live Google SERP preview.
- **Fulfillment & Dispatch Workflow:** Accept orders, generate shipping labels with barcodes, mark packed (auto-assigns courier & AWB), and fast-forward simulated transit.
- **8% Fair Commission Ledger & Wallet:** Transparent commission deductions, COD remittance tracking, and instant payout requests.
- **Analytics & Settings:** Regional sales breakdown, return rates, and dark mode toggle.

### 🛡️ Admin Console (`/admin`)
- **Executive Oversight:** GMV tracking, seller KYC approval, custom commission override, and catalog moderation.
- **Disputes & Payouts:** Force order status override and process seller bank payout batches.
- **Gemini Executive AI Analyst:** Automated strategic insights on regional spikes, COD risks, and inventory replenishment.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Zustand, React Router 7, Recharts, Lucide Icons, Canvas Confetti.
- **AI Engine:** Google Gemini 3.8 Flash (`@google/genai`) invoked through server-side proxy routes (`/api/gemini/*`) with `User-Agent: aistudio-build`.
- **Data Layer:** Typed in-memory & `localStorage` persistence layer (`StorageService`) structured with clear service interfaces for seamless REST/GraphQL backend replacement.

---

## 🔌 Plugging in Production Backend & Payments

1. **Payment Gateway (Razorpay / Cashfree):**
   - Replace simulated checkout in `src/pages/buyer/CheckoutPage.tsx` with Razorpay Checkout Standard SDK (`Razorpay(options).open()`).
   - Create server-side order signature verification route: `POST /api/payments/verify-razorpay`.

2. **Logistics Courier API (Shiprocket / Delhivery / NimbusPost):**
   - In `StorageService.updateSubOrderStatus(subOrderId, 'packed')`, call the courier API to generate genuine AWB numbers and shipping PDF labels.

3. **Backend Database:**
   - Swap `StorageService` calls in `src/services/storage.ts` with API client endpoints connected to PostgreSQL / Cloud SQL via Drizzle ORM.
