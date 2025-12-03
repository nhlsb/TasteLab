import React from 'react';
import { Product } from '../types';
import { Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ products, onSelect }) => {
  // Sort by popularity descending
  const sortedProducts = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">试吃热榜</h2>
      </div>

      <div className="space-y-4">
        {sortedProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => onSelect(product)}
          >
            <div className={`
              w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0
              ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                index === 1 ? 'bg-gray-100 text-gray-600' : 
                index === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}
            `}>
              {index + 1}
            </div>
            
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-grow min-w-0">
              <h4 className="text-sm font-medium text-gray-700 truncate group-hover:text-brand-600 transition-colors">
                {product.name}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <TrendingUp size={12} />
                <span>热度 {product.popularity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};