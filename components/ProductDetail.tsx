import React from 'react';
import { Product, Review } from '../types';
import { Star, Flame, Droplets, ArrowLeft, ShoppingBag, Clock, ShieldCheck, User, Heart } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  onBack: () => void;
  onApply: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  reviews, 
  onBack, 
  onApply,
  isWishlisted,
  onToggleWishlist
}) => {
  const isOutOfStock = product.remainingSamples === 0;

  return (
    <div className="animate-fade-in pb-12">
      {/* Back Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">返回列表</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 h-80 md:h-[500px] relative bg-gray-50">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white/90 text-gray-900 px-6 py-3 rounded-lg font-bold text-xl border-2 border-gray-900 transform -rotate-12 shadow-lg">
                  本期已抢光
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md text-yellow-700 font-bold">
                <Star size={16} className="fill-yellow-500 text-yellow-500" />
                {product.rating} <span className="text-yellow-500/60 font-normal">/ 5.0</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">{reviews.length} 条真实测评</span>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              {product.description}
            </p>

            {/* Flavor Profile */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                  <Flame size={16} className="text-red-500" /> 辣度指数
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${(product.spicyLevel || 0) * 20}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                  <Droplets size={16} className="text-blue-500" /> 甜度指数
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-400 rounded-full" 
                    style={{ width: `${(product.sweetLevel || 0) * 20}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="mt-auto pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">剩余试吃份额</span>
                <span className="text-xl font-bold font-mono text-gray-900">
                  {product.remainingSamples} <span className="text-gray-400 text-base font-normal">/ {product.totalSamples}</span>
                </span>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={onToggleWishlist}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center
                    ${isWishlisted 
                      ? 'border-brand-500 text-brand-500 bg-brand-50' 
                      : 'border-gray-200 text-gray-400 hover:border-brand-300 hover:text-brand-500'}`}
                >
                  <Heart size={24} className={isWishlisted ? "fill-brand-500" : ""} />
                </button>
                <button
                  onClick={() => onApply(product)}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
                    ${isOutOfStock 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200'
                    }`}
                >
                  <ShoppingBag size={20} />
                  {isOutOfStock ? '等待补货' : '立即免费申领'}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1"><ShieldCheck size={12}/> 贵州产地直发</span>
                <span className="flex items-center gap-1"><Clock size={12}/> 48小时发货</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">试吃官反馈</h3>
        <div className="space-y-4">
          {reviews.length > 0 ? reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{review.userName}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-13 ml-13">
                {review.content}
              </p>
            </div>
          )) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
               <p className="text-gray-400">暂无评论，快来抢首发吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};