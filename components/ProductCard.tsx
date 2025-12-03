import React from 'react';
import { Product } from '../types';
import { Star, Flame, Droplets, ArrowRight, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onApply: (product: Product) => void;
  onClick: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onApply, 
  onClick,
  isWishlisted,
  onToggleWishlist
}) => {
  const isOutOfStock = product.remainingSamples === 0;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full cursor-pointer relative"
      onClick={() => onClick(product)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rounded-md transform -rotate-12">
              已抢光
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-brand-700 shadow-sm flex items-center gap-1">
           <Star size={12} className="fill-brand-500 text-brand-500"/> {product.rating}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 z-10
            ${isWishlisted 
              ? 'bg-brand-50 text-brand-500 hover:bg-brand-100' 
              : 'bg-white/80 text-gray-400 hover:text-brand-500 hover:bg-white'}`}
        >
          <Heart size={18} className={isWishlisted ? "fill-brand-500" : ""} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex gap-2 mb-2 flex-wrap">
          {product.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors" title={product.name}>
          {product.name}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
            {product.spicyLevel !== undefined && product.spicyLevel > 0 && (
                 <div className="flex items-center gap-1" title={`辣度: ${product.spicyLevel}`}>
                    <Flame size={14} className="text-red-500" />
                    <span>{product.spicyLevel}</span>
                 </div>
            )}
            {product.sweetLevel !== undefined && product.sweetLevel > 0 && (
                 <div className="flex items-center gap-1" title={`甜度: ${product.sweetLevel}`}>
                    <Droplets size={14} className="text-pink-400" />
                    <span>{product.sweetLevel}</span>
                 </div>
            )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">剩余份数</span>
            <span className={`font-bold ${product.remainingSamples < 10 ? 'text-red-500' : 'text-gray-800'}`}>
              {product.remainingSamples} <span className="text-gray-400 font-normal">/ {product.totalSamples}</span>
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(product);
            }}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 z-10
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-md shadow-brand-200'
              }`}
          >
            {isOutOfStock ? '下期见' : '申领'}
            {!isOutOfStock && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};