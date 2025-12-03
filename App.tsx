import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from './constants';
import { Product, ViewState } from './types';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Leaderboard } from './components/Leaderboard';
import { RulesModal } from './components/RulesModal';
import { AIChat } from './components/AIChat';
import { Utensils, BookOpen, Search, Menu, ShoppingBag, X, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [reviews] = useState(MOCK_REVIEWS);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  
  // Navigation State
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Updated Categories for Guizhou Food
  const categories = ['全部', '黔菜', '米粉', '小吃', '调料', '甜品'];

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // 2. Filter by Wishlist
    if (showWishlistOnly) {
      result = result.filter(p => wishlist.has(p.id));
    }

    // 3. Filter by Category
    if (!showWishlistOnly && activeCategory !== '全部') {
      result = result.filter(p => p.tags.includes(activeCategory));
    }

    return result;
  }, [products, searchQuery, activeCategory, showWishlistOnly, wishlist]);

  const handleApply = (product: Product) => {
    alert(`申请成功！\n您已申请试吃：${product.name}\n请留意发货通知。`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setViewState(ViewState.PRODUCT_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setViewState(ViewState.HOME);
    setSelectedProductId(null);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedProductReviews = reviews.filter(r => r.productId === selectedProductId);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf8]">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => {
                handleBackToHome();
                setShowWishlistOnly(false);
              }}
            >
              <div className="bg-brand-600 text-white p-1.5 rounded-lg">
                <Utensils size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                TasteLab <span className="text-brand-600 text-xs font-normal bg-brand-50 px-1 rounded ml-1">贵州站</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              <button 
                onClick={() => {
                  handleBackToHome();
                  setShowWishlistOnly(false);
                }} 
                className={`${viewState === ViewState.HOME && !showWishlistOnly ? 'text-brand-600 font-bold' : 'hover:text-gray-900'} transition-colors`}
              >
                探索美味
              </button>
              <button 
                onClick={() => {
                  setViewState(ViewState.HOME);
                  setShowWishlistOnly(true);
                  setActiveCategory('全部');
                }}
                className={`flex items-center gap-1 ${showWishlistOnly ? 'text-brand-600 font-bold' : 'hover:text-gray-900'} transition-colors`}
              >
                <Heart size={16} className={showWishlistOnly ? "fill-brand-600" : ""} />
                心愿单 
                {wishlist.size > 0 && (
                  <span className="bg-brand-100 text-brand-600 text-[10px] px-1.5 rounded-full">{wishlist.size}</span>
                )}
              </button>
              <button 
                onClick={() => setIsRulesOpen(true)}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors"
              >
                <BookOpen size={16} /> 规则
              </button>
            </div>

            <div className="flex items-center gap-4">
               {/* Mini Search Bar (Nav) - Hidden on mobile if needed, but keeping for utility */}
               <div className="relative hidden md:block group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if(viewState !== ViewState.HOME) setViewState(ViewState.HOME);
                    }}
                    placeholder="搜特产..." 
                    className="pl-9 pr-4 py-1.5 bg-gray-100 border-transparent border focus:bg-white focus:border-brand-500 rounded-full text-xs text-gray-700 focus:outline-none focus:ring-0 w-32 transition-all focus:w-48"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
               </div>
               <button className="text-gray-600 md:hidden">
                 <Menu size={24} />
               </button>
               <button className="text-gray-600 hover:text-brand-600 transition-colors relative">
                  <ShoppingBag size={24} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      {viewState === ViewState.HOME ? (
        <>
          {/* Hero Section */}
          {!showWishlistOnly && (
            <div className="bg-white border-b border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center relative z-10">
                <span className="text-brand-600 font-bold tracking-widest text-xs uppercase mb-4 block">
                  Guizhou Flavor Laboratory
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                  探寻<span className="text-brand-600">多彩贵州</span>的
                  <br className="md:hidden" />
                  <span className="relative inline-block ml-2">
                    隐秘风味
                    <svg className="absolute w-full h-3 bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                       <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                  酸汤鱼、羊肉粉、折耳根... TasteLab 带你免费体验地道黔味。
                  <br/>申请试吃，成为风味鉴赏家。
                </p>

                {/* Prominent Search Bar */}
                <div className="max-w-xl mx-auto relative mb-10 shadow-xl shadow-brand-100/50 rounded-full">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="想找什么？试试 '酸汤' 或 '辣酱'..."
                    className="w-full pl-6 pr-14 py-4 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none text-gray-700 placeholder-gray-400 transition-all text-base"
                  />
                  <div className="absolute right-2 top-1.5 bottom-1.5">
                    <button className="h-full aspect-square bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center transition-colors">
                      <Search size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center gap-6 text-sm font-medium text-gray-400">
                   <div className="flex items-center gap-1.5">
                      <span className="text-brand-500">★</span> 产地直供
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-brand-500">★</span> 0元尝鲜
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-brand-500">★</span> 真实口碑
                   </div>
                </div>
              </div>
            </div>
          )}

          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Left Column: Products */}
              <div className="flex-1">
                <div className="sticky top-20 z-20 bg-[#fcfaf8]/95 backdrop-blur-sm py-4 mb-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/50 gap-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {showWishlistOnly 
                      ? <><Heart className="text-brand-500 fill-brand-500"/> 我的心愿单</> 
                      : searchQuery 
                        ? `搜索: "${searchQuery}"` 
                        : "当季甄选"}
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {filteredProducts.length}
                    </span>
                  </h2>
                  
                  {!showWishlistOnly && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                            ${activeCategory === cat 
                              ? 'bg-brand-600 text-white shadow-md shadow-brand-200' 
                              : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onApply={handleApply}
                        onClick={handleProductClick}
                        isWishlisted={wishlist.has(product.id)}
                        onToggleWishlist={() => toggleWishlist(product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                       {showWishlistOnly ? <Heart size={32} /> : <Search size={32} />}
                    </div>
                    <p className="text-gray-500 font-medium">
                      {showWishlistOnly ? "心愿单空空如也" : "没有找到相关美食"}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {showWishlistOnly 
                        ? "快去添加你喜欢的贵州美味吧！" 
                        : "换个关键词，或者让 AI 帮您推荐试试？"}
                    </p>
                    <button 
                       onClick={() => {
                         setSearchQuery('');
                         setActiveCategory('全部');
                         setShowWishlistOnly(false);
                       }}
                       className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-full text-brand-600 font-bold hover:border-brand-500 transition-colors"
                    >
                      查看全部商品
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Leaderboard (Hide in Wishlist mode to reduce clutter) */}
              {!showWishlistOnly && (
                <aside className="w-full lg:w-80 flex-shrink-0 space-y-8 hidden lg:block">
                  <Leaderboard 
                    products={products} 
                    onSelect={handleProductClick} 
                  />
                  
                  {/* Promo Card */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer border border-gray-700">
                     <div className="relative z-10">
                       <span className="bg-brand-500 text-white text-[10px] px-2 py-0.5 rounded mb-3 inline-block font-bold">LIMITED</span>
                       <h3 className="font-bold text-lg mb-2">寻味贵州之旅</h3>
                       <p className="text-gray-400 text-sm mb-4">参与线下试吃会，赢取贵阳往返机票。</p>
                     </div>
                     <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-600 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                  </div>
                </aside>
              )}

            </div>
          </main>
        </>
      ) : (
        /* Detail View */
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {selectedProduct && (
            <ProductDetail 
              product={selectedProduct} 
              reviews={selectedProductReviews}
              onBack={handleBackToHome}
              onApply={handleApply}
              isWishlisted={wishlist.has(selectedProduct.id)}
              onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
            />
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
             <Utensils size={20} /> TasteLab
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 TasteLab. 专注于贵州地道风味推广.
          </p>
        </div>
      </footer>

      <AIChat products={products} />
      
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
};

export default App;