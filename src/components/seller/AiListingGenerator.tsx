import React, { useState } from 'react';
import { GeminiService, AiListingResult } from '../../services/geminiClient';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Check,
  Search,
  Eye,
  Tag,
  IndianRupee,
  Layers,
  FileText,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AiListingGeneratorProps {
  onProductCreated?: (product: Product) => void;
}

export const AiListingGenerator: React.FC<AiListingGeneratorProps> = ({ onProductCreated }) => {
  const { currentUser, addToast } = useStore();
  const categories = StorageService.getCategories();

  // Input states
  const [roughKeywords, setRoughKeywords] = useState('handwoven chanderi silk saree emerald green');
  const [category, setCategory] = useState('Handlooms & Sarees');
  const [priceHint, setPriceHint] = useState<number>(4500);
  const [rawNotes, setRawNotes] = useState('Pure silk zari border, traditional floral booti, includes unstitched blouse piece.');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    '/src/assets/images/chanderi_silk_saree_1790850427979.jpg',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated & Editable Output States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [suggestedPriceMin, setSuggestedPriceMin] = useState(3800);
  const [suggestedPriceMax, setSuggestedPriceMax] = useState(5500);
  const [actualPrice, setActualPrice] = useState<number>(4899);
  const [originalPrice, setOriginalPrice] = useState<number>(7500);
  const [stock, setStock] = useState<number>(10);
  const [seoScore, setSeoScore] = useState<number>(0);
  const [seoTips, setSeoTips] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'buyerPreview' | 'googlePreview'>('form');

  // Handle image upload mock / base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUploadedImages((prev) => [...prev.slice(0, 4), uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!roughKeywords.trim()) {
      addToast({ title: 'Please provide rough keywords', type: 'error' });
      return;
    }

    setIsGenerating(true);
    try {
      const sellerProfile = StorageService.getSellerById(currentUser.sellerId || 'seller_1');
      const result: AiListingResult = await GeminiService.generateListing({
        keywords: roughKeywords,
        category,
        brandName: sellerProfile?.storeName || 'Artisan Workshop',
        priceHint,
        rawNotes,
        imageData: uploadedImages[0],
      });

      setTitle(result.title);
      setDescription(result.description);
      setFeatures(result.features);
      setTags(result.tags);
      setMetaTitle(result.metaTitle);
      setMetaDescription(result.metaDescription);
      setSuggestedPriceMin(result.suggestedPriceMin);
      setSuggestedPriceMax(result.suggestedPriceMax);
      setActualPrice(priceHint || Math.round((result.suggestedPriceMin + result.suggestedPriceMax) / 2));
      setOriginalPrice(Math.round(actualPrice * 1.4));
      setSeoScore(result.seoScore);
      setSeoTips(result.seoTips);
      setHasGenerated(true);

      addToast({
        title: 'Listing synthesized with Gemini!',
        message: `SEO Quality Score: ${result.seoScore}/100`,
        type: 'success',
      });
    } catch (err) {
      addToast({ title: 'Generation failed', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!title.trim()) {
      addToast({ title: 'Title is required', type: 'error' });
      return;
    }

    const seller = StorageService.getSellerById(currentUser.sellerId || 'seller_1');
    const selectedCategory = categories.find((c) => c.name === category) || categories[0];

    const newProd = StorageService.addProduct({
      sellerId: seller?.id || 'seller_1',
      sellerName: seller?.storeName || 'Varanasi Weavers Guild',
      sellerRating: seller?.rating || 4.9,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      shortDescription: description.slice(0, 140) + '...',
      category: selectedCategory.name,
      categoryId: selectedCategory.id,
      price: actualPrice,
      originalPrice,
      discountPercent: Math.round(((originalPrice - actualPrice) / originalPrice) * 100),
      stock,
      images: uploadedImages.length > 0 ? uploadedImages : ['/src/assets/images/chanderi_silk_saree_1790850427979.jpg'],
      codAvailable: true,
      rating: 5.0,
      reviewCount: 0,
      features,
      tags,
      attributes: {
        Handcrafted: 'Yes',
        Heritage: 'GI / Craft Cluster Verified',
        DispatchedFrom: `${seller?.city || 'Varanasi'}, ${seller?.state || 'Uttar Pradesh'}`,
      },
      seoTitle: metaTitle,
      seoDescription: metaDescription,
      seoScore,
      isNew: true,
      status: 'active',
    });

    addToast({
      title: 'Product Published Successfully!',
      message: `"${title.slice(0, 28)}..." is now live on Ecomma.`,
      type: 'success',
    });

    if (onProductCreated) {
      onProductCreated(newProd);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F1B2D] via-[#1E293B] to-[#0F1B2D] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/20 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#F59E0B] text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Listing Assistant</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-white">
            List in 60 Seconds with Gemini Multimodal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Drop product photos and rough keywords. Gemini writes search-engine optimized copy, buyer-focused features, pricing recommendations, and catalog metadata.
          </p>
        </div>

        {/* Ambient background accent */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#F59E0B]/10 to-transparent pointer-events-none" />
      </div>

      {/* Two Column Layout: Inputs on Left, Output & Previews on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Seller Rough Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F1B2D]">1. Product Photos & Rough Notes</h3>
              <span className="text-[11px] text-slate-400 font-medium">Step 1 of 2</span>
            </div>

            {/* Images Upload / Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Product Images (1 to 5 Photos)
              </label>
              <div className="grid grid-cols-4 gap-2.5 mb-3">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-[#F59E0B] hover:bg-amber-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-amber-800">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-medium">Add</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Rough Keywords */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Rough Keywords or Words
              </label>
              <input
                type="text"
                value={roughKeywords}
                onChange={(e) => setRoughKeywords(e.target.value)}
                placeholder="e.g., green chanderi silk saree zari border festive"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
              <p className="text-[11px] text-slate-400 mt-1">Just type raw thoughts; Gemini will convert into high-converting copy.</p>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category Cluster
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Target Price Estimate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Approximate Target Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  value={priceHint}
                  onChange={(e) => setPriceHint(Number(e.target.value))}
                  placeholder="4500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>
            </div>

            {/* Additional artisan notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Artisan / Material Specifics (Optional)
              </label>
              <textarea
                rows={2}
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Specific weave count, unstitched blouse details, wash care notes..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F1B2D] to-[#1E293B] hover:from-[#1E293B] hover:to-[#0F1B2D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F59E0B]" />
                  <span>Gemini is composing your listing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>Generate Listing with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Output & Live Previews */}
        <div className="lg:col-span-7 space-y-6">
          {/* View Mode Tabs */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-sm">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'form'
                    ? 'bg-[#0F1B2D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Generated Listing Fields
              </button>
              <button
                onClick={() => setActiveTab('buyerPreview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'buyerPreview'
                    ? 'bg-[#0F1B2D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Buyer View Preview
              </button>
              <button
                onClick={() => setActiveTab('googlePreview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'googlePreview'
                    ? 'bg-[#0F1B2D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Google SERP Snippet
              </button>
            </div>

            {hasGenerated && (
              <div className="pr-3 flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">SEO Score:</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold font-mono">
                  {seoScore}/100
                </span>
              </div>
            )}
          </div>

          {!hasGenerated && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-slate-900">
                Ready to Generate Your Product Listing
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Fill in rough keywords on the left and click <strong>&quot;Generate Listing with AI&quot;</strong>. Gemini will produce an SEO title, storytelling description, bullet points, tags, and suggested pricing.
              </p>
            </div>
          )}

          {hasGenerated && activeTab === 'form' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Product Title (SEO Optimized)</span>
                  <span className="text-[11px] text-slate-400 font-normal">{title.length} characters</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Artisanal Story & Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 leading-relaxed focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>

              {/* Bullet Features */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bullet Points / Key Features
                </label>
                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-amber-500 font-bold text-xs mt-1">✓</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx] = e.target.value;
                          setFeatures(updated);
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Stock Grid */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Gemini Suggested Price Range</span>
                  </div>
                  <div className="text-xs font-bold text-teal-800 tabular-nums">
                    {formatCurrency(suggestedPriceMin)} – {formatCurrency(suggestedPriceMax)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      value={actualPrice}
                      onChange={(e) => setActualPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">MRP Strike (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 line-through tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Units in Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Score & Tips Accordion */}
              {seoTips.length > 0 && (
                <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-950">
                    <Lightbulb className="w-4 h-4 text-teal-600" />
                    <span>Gemini SEO Recommendations ({seoScore}/100)</span>
                  </div>
                  <ul className="text-xs text-teal-900 space-y-1 pl-5 list-disc">
                    {seoTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Search Tags & Keywords</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Publish Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Fields</span>
                </button>

                <button
                  onClick={handlePublish}
                  className="px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-[#0F1B2D] font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish to Ecomma Marketplace</span>
                </button>
              </div>
            </div>
          )}

          {/* Buyer Live Card Preview Tab */}
          {hasGenerated && activeTab === 'buyerPreview' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm flex flex-col items-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Card Preview in Marketplace Feed
              </div>
              <div className="max-w-sm w-full">
                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">
                  <div className="relative aspect-[4/3] bg-stone-100">
                    <img src={uploadedImages[0]} alt={title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#14B8A6] text-white text-[10px] font-bold uppercase">
                      COD Available
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">
                      {category}
                    </div>
                    <div className="font-semibold text-sm text-[#0F1B2D] line-clamp-2">
                      {title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      By {StorageService.getSellerById(currentUser.sellerId || 'seller_1')?.storeName || 'Verified Artisan'}
                    </div>
                    <div className="pt-2 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg text-slate-900 tabular-nums">
                          {formatCurrency(actualPrice)}
                        </span>
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          {formatCurrency(originalPrice)}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {Math.round(((originalPrice - actualPrice) / originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Google SERP Snippet Preview Tab */}
          {hasGenerated && activeTab === 'googlePreview' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Google Search Result Snippet Preview
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans max-w-xl space-y-1">
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-[9px]">
                    E
                  </div>
                  <span className="text-slate-800 font-medium">https://ecomma.in</span>
                  <span className="text-slate-400">› products › {title.toLowerCase().slice(0, 20)}</span>
                </div>
                <div className="text-blue-700 hover:underline text-base font-medium cursor-pointer line-clamp-1">
                  {metaTitle || `${title} | Ecomma Marketplace`}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {metaDescription || description.slice(0, 160)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
